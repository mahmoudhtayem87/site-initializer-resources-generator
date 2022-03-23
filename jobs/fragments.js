/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all of the site fragments collections and its fragments and 
 * store them in the site site initializer required format
 */
const Axios = require('axios').default;
var request = require('request');
var dir = './output/resources/site-initializer/fragments';
const applications = require('../services/applications');
const config = require('../config');
fs = require('fs');
var builder = require('xmlbuilder');
const { XMLParser } = require('fast-xml-parser');

async function processSubFolderFile(element, basePath) {
    var fileName = `${element.title}`;
    fileName = fileName.indexOf('.') === -1 ? `${fileName}.${element.fileExtension}` : fileName;
    fileName = `${basePath}/${fileName}`
    try {
        await downloadFile(`${config.config().liferay.host}/${element.contentUrl}`, `${fileName}`)
    } catch (exp) {
        fs.unlink(`${fileName}`, function (err) {
            if (err) throw err;
        });
        console.error(`Error while downloading file: ${element.title}`)
    }
}
async function processFragment(basePath, element) {
    var fragmentDir = `${basePath}/${element.name}`;
    await checkSubFolder(`${dir}/${fragmentDir}`);
    var fragment_info = {
        "configurationPath": "index.json",
        "cssPath": "index.css",
        "htmlPath": "index.html",
        "jsPath": "index.js",
        "name": element.name,
        "thumbnailPath": "thumbnail.png",
        "type": "component"
    };
    createFile(JSON.stringify(fragment_info), `/${fragmentDir}/fragment.json`);
    createFile(element.html, `/${fragmentDir}/index.html`);
    createFile(element.css, `/${fragmentDir}/index.css`);
    createFile(element.js, `/${fragmentDir}/index.js`);
    createFile(element.configuration, `/${fragmentDir}/index.json`);
}
async function processCollection(element) {
    console.log(`Processing Fragment Collection ${element.name}!`);
    var collectionDir = `${dir}/${element.name}`;
    await checkSubFolder(collectionDir);
    var collectionFragments = await applications.getFragmentsByCollectionId(element.fragmentCollectionId);
    for (var index = 0; index < collectionFragments.length; index++) {
        console.log(`Processing fragment ${collectionFragments[index].name}!`);
        processFragment(element.name, collectionFragments[index]);
    }
    var collection_Info = {
        "description": element.description,
        "name": element.name,
        "fragmentCollectionKey":element.fragmentCollectionKey
    };
    createFile(JSON.stringify(collection_Info), `/${element.name}/collection.json`);

}
async function createFile(filedata, filename) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}`, filedata.toString(), function (err) {
        if (err) return console.error(err);
    });
}
async function checkFolder() {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
async function checkSubFolder(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
async function start() {
    var rows = await applications.getFragmentCollections();
    await checkFolder();
    if (rows == null || rows == null || rows.length <= 0) {
        console.info(`No Fragments Collections found!`);
        return;
    }
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        processCollection(rows[index]);
    }
}
async function downloadFile(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);
    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
            });
        });
    });
}
async function processRootFolders() {
    var basePath = dir;
    var rootFolders = (await applications.getRootFolders()).items;
    for (index = 0; index < rootFolders.length; index++) {
        processSubFolder(basePath, rootFolders[index]);
    }
}
async function processSubFolder(basePath, folderEelement) {
    basePath = `${basePath}/${folderEelement.name}`;
    checkSubFolder(basePath);
    if (folderEelement.numberOfDocumentFolders > 0) {
        var subFolders = await applications.getSubFolders(folderEelement.id);
        for (index = 0; index < subFolders.items.length; index++) {
            processSubFolder(basePath, subFolders.items[index]);
        }
    }
    var files = await applications.getSubFoldersFiles(folderEelement.id);
    for (index = 0; index < files.items.length; index++) {
        processSubFolderFile(files.items[index], basePath);
    }
}
module.exports = {
    start
}



