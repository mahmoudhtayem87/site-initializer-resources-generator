const request = require('request');

const applications = require('../services/applications');
const config = require('../config');
const helper = require('../helper');

const rootDir = './output/resources/site-initializer/commerce-catalogs';


async function start() {
  await helper.checkFolder(rootDir);
  var rows = await applications.getCommerceCatalogs();
  if (rows == null || rows.items == null || rows.items.length <= 0) {
    console.info(`No Commerce Catalogs found!`);
    return;
  }
  for (let index = 0; index < rows.items.length; index++) {
    const element = rows.items[index];
    processCatalog(element);
  }
}

async function processCatalog(element) {
  const catalogName = element.name.replace(/\s+/g, '-').toLowerCase() + '-commerce-catalog';
  console.log(`Processing ${catalogName}`);
  exportCatalog(catalogName, element);

  //downloadProductImages(catalogName, element);
}

async function exportCatalog(catalogName, element) {
  var catalogData = {
    "assetVocabularyName": element.name,
    "currencyCode": element.currencyCode,
    "defaultLanguageId": element.defaultLanguageId,
    "externalReferenceCode": element.externalReferenceCode,
    "name": element.name
  };
  await helper.createFile(JSON.stringify(catalogData), rootDir, catalogName + ".json");
  //exportOptions(catalogName)
}

async function exportOptions(catalogName) {
  var rows = await new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': `${config.config().liferay.host}/o/headless-commerce-admin-catalog/v1.0/options?page=0&pageSize=999999`,
      'headers': {
        'Authorization': helper.getAuthHeader(config)
      }
    };
    request(options, function (error, response) {
      if (error) {
        reject(error)
      };
      resolve(JSON.parse(response.body));
    });
  });

  if (rows == null || rows.items == null || rows.items.length <= 0) {
    console.info(`No Commerce Options found!`);
    return;
  }
  var optionsData = [];
  for (let index = 0; index < rows.items.length; index++) {
    const element = rows.items[index];
    optionsData.push(

    );
  }
  await helper.createFile(JSON.stringify(optionsData), rootDir, catalogName + "-options.json");
}

async function downloadProductImages(catalogName, element) {
  await helper.checkFolder(`${rootDir}/${catalogName}`)
  console.log(`${rootDir}/${catalogName}`);
}

module.exports = {
  start
}
