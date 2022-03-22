var dir = './output/resources/site-initializer/ddm-structures';
const webContentArticle = require('./webContentArticle.js');
const applications = require('../services/applications');
const helper = require('../helper');
const config = require('../config');
fs = require('fs');
var builder = require('xmlbuilder');
const { XMLParser } = require('fast-xml-parser');

async function getXMLData(element) {
    const parser = new XMLParser();
    var structureName = element.name;
    console.info(`Processing Web Content Structure ${structureName}`);
    var root = builder.create('root');
    root = root.ele("structure");
    root = root.ele("name").text(helper.replaceSpace(element.name));
    root = root.up();
    root = root.ele("description").text(element.description == "" ? "" : element.description);
    root = root.up();
    root = root.ele("definition").cdata(JSON.stringify(await applications.getContentStructureWebDav(element.id)));
    root = root.end({ pretty: true });
    await createFile(root, structureName + ".xml");
}

async function createFile(filedata, filename) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}`, filedata, function (err) {
        if (err) return console.error(err);
    });
}
async function start() {
    var data = await applications.getContentStructures();
    //console.log(data);
    console.info(`${data.length} Web Content Structures Found!`);
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        getXMLData(element);
        webContentArticle.start(element);
    }
}
module.exports = {
    start
}
