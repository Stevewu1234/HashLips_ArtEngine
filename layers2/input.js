const dir = __dirname;
const fs = require("fs");
const width = 1000;
const height = 1000;

const rarity = [
    { key: "", val: "original" },
    { key: "_01", val: "rare" },
    { key: "_02", val: "super rare" },
];

const addRarity = (_str) => {
    let itemRarity;
    rarity.forEach((r) => {
        if (_str.includes(r.key)) {
            itemRarity = r.val;
        }
    });
    return itemRarity;
}

const clearName = (_str) => {
    let name = _str.slice(0, -4);
    rarity.forEach((r) => {
        name = name.replace(r.key, "");
    });
    return name;
}



const getElements = (path) => {
    // console.log(fs.readdirSync(path));
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^|\/.]/g.test(item))
        .map((i, index) => {   // i is value of file array which is read by readdirSync(path)
            return {
                id: index + 1,
                name: clearName(i),
                fileName: i,
                rarity: addRarity(i),
            };
        });
};

const layers = [
    {
        id: 1,
        name: "body",
        location: `${dir}/body/`,
        elements: getElements(`${dir}/body/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },

    {
        id: 2,
        name: "eye",
        location: `${dir}/eye/`,
        elements: getElements(`${dir}/eye/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },

    {
        id: 3,
        name: "hair",
        location: `${dir}/hair/`,
        elements: getElements(`${dir}/hair/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },

    {
        id: 4,
        name: "hand",
        location: `${dir}/hand/`,
        elements: getElements(`${dir}/hand/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },

    {
        id: 5,
        name: "horn",
        location: `${dir}/horn/`,
        elements: getElements(`${dir}/horn/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },

    {
        id: 6,
        name: "mouth",
        location: `${dir}/mouth/`,
        elements: getElements(`${dir}/mouth/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },

    {
        id: 7,
        name: "tail",
        location: `${dir}/tail/`,
        elements: getElements(`${dir}/tail/`),
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
    },
]

module.exports = { layers, width, height };
