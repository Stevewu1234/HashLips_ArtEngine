"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");
const sha1 = require(path.join(basePath, "/node_modules/sha1"));
const { createCanvas, loadImage } = require(path.join(
  basePath,
  "/node_modules/canvas"
));
const buildDir = path.join(basePath, "/build");
const layersDir = path.join(basePath, "/layers");


const {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
} = require(path.join(basePath, "/src/config.js"));
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
var metadataList = [];
var attributesList = [];
var dnaList = [];

const buildSetup = () => {

  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(path.join(buildDir, "/json"));
  fs.mkdirSync(path.join(buildDir, "/images"));
};

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var weightWithoutName = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()
  );
  if (isNaN(weightWithoutName)) {
    weightWithoutName = 0;
  }
  return weightWithoutName;
};

const cleanDna = (_str) => {
  var dna = Number(_str.split(":").shift());
  return dna;
};

const cleanName = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight; 
};

const getElements = (path) => {
  return fs
    .readdirSync(path)                // read all the files from the path
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))  // remove all hidden files from the result
    .map((i, index) => {
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
};

const layersSetup = (layersOrder, subDir) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    elements: getElements(`${layersDir}/${subDir}/${layerObj.name}/`),
    blendMode: layerObj["blend"] != undefined ? layerObj["blend"] : "source-over",
    opacity: layerObj["opacity"] != undefined ? layerObj["opacity"] : 1,
  }));
  return layers;
};


const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: sha1(_dna.join("")),
    name: `Theta Fish`,
    description: description,
    image: `${baseUri}/${_edition}.png`,
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
    compiler: "HashLips Art Engine",
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const drawElement = (_renderObject) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blendMode;
  ctx.drawImage(_renderObject.loadedImage, 0, 0, format.width, format.height);
  addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = [], _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(  // layer.elements have multiple elements. Then the find() will select the one whose id is matching the dna
      (e) => e.id == cleanDna(_dna[index])  // _dna[index] = ${layer.elements[i].id}:${layer.elements[i].filename}
    );
    return {
      name: layer.name,
      blendMode: layer.blendMode,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
  return foundDna == undefined ? true : false;
};


// add new demand: body and hand one to one
const createDna = (_layers) => {
  let randNum = [];
  let bodyRandom = 0;
  _layers.forEach((layer) => {
    var totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });


    // if match hand layer, that get the id of body to select the corresponding hand id
    if(layer.name.includes('hand')) {
      for (var i = 0; i < layer.elements.length; i++) {
        if(layer.elements[i].name.substr(10) === bodyRandom.toString()) {
          // console.log(bodyRandom, layer.elements[i].filename);
          bodyRandom = 0;
          return randNum.push(`${layer.elements[i].id}:${layer.elements[i].filename}`)
        }
      }
    }
  

    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {

      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        
        if(layer.elements[i].name.includes('body')) {
          bodyRandom = layer.elements[i].name.substr(10);
        }
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}`
        );
      }
    }
  });
  return randNum;
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
  debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

function shuffle(array) {   // disrupted array
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async () => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractedIndexes = [];
  for (
    let i = 1;
    i <= layerConfigurations[layerConfigurations.length - 1].totalEdition;
    i++
  ) {
    abstractedIndexes.push(i);
  }
  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }
  debugLogs
    ? console.log("Editions left to create: ", abstractedIndexes)
    : null;
  while (layerConfigIndex < layerConfigurations.length) {

    // add customized logic to generate a new generativeArt
    for(let i = 1; i <= 3; i++ ) {
      console.log(`dealing with subDir: classify${i}`)
      const subDir = `classify${i}`;
      const layersOrder = layerConfigurations[layerConfigIndex].layersOrder[i-1]

      const layers = layersSetup(
        layersOrder, subDir
      );
      while (
        editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
      ) {
        let newDna = createDna(layers);
        if (isDnaUnique(dnaList, newDna)) {
          let results = constructLayerToDna(newDna, layers);
          let loadedElements = [];
  
          results.forEach((layer) => {
            loadedElements.push(loadLayerImg(layer));
          });
  
          await Promise.all(loadedElements).then((renderObjectArray) => {  // renderObjectArray = [_layer, image]
            debugLogs ? console.log("Clearing canvas") : null;
            ctx.clearRect(0, 0, format.width, format.height);
            if (background.generate) {
              drawBackground();
            }
            renderObjectArray.forEach((renderObject) => {
              drawElement(renderObject);
            });
            debugLogs
              ? console.log("Editions left to create: ", abstractedIndexes)
              : null;
            saveImage(abstractedIndexes[0]);   // abstractedIndexes[0] = edition
            addMetadata(newDna, abstractedIndexes[0]);
            saveMetaDataSingleFile(abstractedIndexes[0]);
            console.log(
              `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
                newDna.join("")
              )}`
            );
          });
          dnaList.push(newDna);
          editionCount++;
          abstractedIndexes.shift();
        } else {
          console.log("DNA exists!");
          failedCount++;
          if (failedCount >= uniqueDnaTorrance) {
            console.log(
              `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
            );
            process.exit();
          }
        }
      }
      
      editionCount = 1;
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };
