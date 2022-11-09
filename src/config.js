"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { MODE } = require(path.join(basePath, "src/blendMode.js"));
const description =
  "The Merge Panda for 2021 SHANGHAI ETHEREUM MEETUP";
const baseUri = "ipfs://QmT34Pv1tnFVD9zvsn9jfYuJ1LkanepnTXq6kSz5AC9ELB";

// console.log(process.cwd());

const layerConfigurations = [
  {
    totalEdition: 9999,
    growEditionSizeTo: 3333,
    layersOrder: [[
      { name: "1.background" },
      { name: "2.bedsheet"},
      { name: "3.body" },
      { name: "4.eyes" },
      { name: "5.mouth" },
      { name: "6.stuff" },
      { name: "7.hand" },
      { name: "8.quilt" },
      { name: "9.Special" },
      // { name: "Bottom lid", blend: MODE.color, opacity: 0.7 },
    ],
    [
      { name: "1.background" },
      { name: "2.bedsheet"},
      { name: "3.body" },
      { name: "4.eyes" },
      { name: "5.mouth" },
      { name: "6.quilt" },
      { name: "7.stuff" },
      { name: "8.hand" },
      { name: "9.Special" },
      // { name: "Bottom lid", blend: MODE.color, opacity: 0.7 },
    ],
    [
      { name: "1.background" },
      { name: "2.bedsheet"},
      { name: "3.body" },
      { name: "4.hand" },
      { name: "5.eyes" },
      { name: "6.mouth" },
      { name: "7.stuff" },
      { name: "8.quilt" },
      { name: "9.Special" },
      // { name: "Bottom lid", blend: MODE.color, opacity: 0.7 },
    ]]
  },

  // {
  //   growEditionSizeTo: 100,
  //   layersOrder: [
  //     { name: "Background" },
  //     { name: "Bottom lid"},
  //     { name: "Eye color" },
  //     { name: "Eyeball" },
  //     { name: "Goo" },
  //     { name: "Iris" },
  //     { name: "Shine" },
  //     { name: "Top lid" },
  //     // { name: "Bottom lid", blend: MODE.color, opacity: 0.7 },
  //   ],
  // },


];

// const layerConfigurations = [
//   {
//     growEditionSizeTo: 30,
//     layersOrder: [
//       { name: "body" },
//       { name: "eye" },
//       { name: "hair" },
//       { name: "hand" },
//       { name: "horn" },
//       { name: "mouth"},
//       { name: "tail" },
//       // { name: "Bottom lid", blend: MODE.color, opacity: 0.7 },
//     ],
//   },
// ];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
  width: 2480,
  height: 2480,
};

const background = {
  generate: true,
  brightness: "80%",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 100;

const preview = {
  thumbPerRow: 20,
  thumbWidth: 150,
  imageRatio: format.width / format.height,
  imageName: "preview.png",
};


module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
};
