const Axios = require('axios').default;
var request = require('request');
var dir = './output/resources/site-initializer/documents/group';
const applications = require('../services/applications');
const config = require('../config');
fs = require('fs');
var builder = require('xmlbuilder');
const { XMLParser } = require('fast-xml-parser');

async function processSubFolderFile(element,basePath) {
  try {
    await downloadFile(`${config.config().liferay.host}/${element.contentUrl}`, `${basePath}/${element.title}`)
  } catch (exp) {
    fs.unlink(`${dir}/${element.title}`, function (err) {
      if (err) throw err;
    });
    console.error(`Error while downloading file: ${element.title}`)
  }

}
async function processFile(element) {
  try {
    await downloadFile(`${config.config().liferay.host}/${element.contentUrl}`, `${dir}/${element.title}`)
  } catch (exp) {
    fs.unlink(`${dir}/${element.title}`, function (err) {
      if (err) throw err;
    });
    console.error(`Error while downloading file: ${element.title}`)
  }

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
  var rows = await applications.getRootDocuments();
  await checkFolder();
  processRootFolders();
  if (rows == null || rows.items == null || rows.items.length <= 0) {
    console.info(`No Documents and Media found!`);
    return;
  }
  for (let index = 0; index < rows.items.length; index++) {
    const element = rows.items[index];
    processFile(rows.items[index]);
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
  for(index = 0 ; index < rootFolders.length; index++)
  {
    processSubFolder(basePath,rootFolders[index]);
  }
}
async function processSubFolder(basePath,folderEelement)
{
  basePath = `${basePath}/${folderEelement.name}`;
  checkSubFolder(basePath);
  if(folderEelement.numberOfDocumentFolders > 0 )
  {
    var subFolders = await applications.getSubFolders(folderEelement.id);
    for(index = 0 ; index < subFolders.items.length ; index++)
    {
      processSubFolder(basePath,subFolders.items[index]);
    }
  }
  var files = await applications.getSubFoldersFiles(folderEelement.id);
    for(index = 0 ; index < files.items.length ; index++)
    {
      processSubFolderFile(files.items[index],basePath);
    }
}
module.exports = {
  start
}



