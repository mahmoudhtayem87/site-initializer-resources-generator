const Axios = require('axios').default;
var request = require('request');
var dir = './output/resources/site-initializer/documents/group';
const applications = require('../services/applications');
const config = require('../config');
var builder = require('xmlbuilder');
const { XMLParser } = require('fast-xml-parser');
const helper = require('../helper');


async function processFile(element) {
    try{
        await downloadFile(`${config.config().liferay.host}/${element.contentUrl}`,`${dir}/${element.title}`)
    }catch(exp)
    {
        fs.unlink(`${dir}/${element.title}`, function (err) {
            if (err) throw err;
        });
        console.error(`Error while downloading file: ${element.title}`)
    }
    
}

async function start() {
    var rows = await applications.getRootDocuments();
    await helper.checkFolder(dir);
    if(rows == null || rows.items == null || rows.items.length <=0)
    {
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
module.exports = {
    start
}



