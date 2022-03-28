/**
 * @author Peter Richards
 * @description this job is used to pull the Commerce products
 */
const request = require('request');

const config = require('../config');
const commerceContext = require('../commerceContext');
const helper = require('../helper');

const rootDir = './output/resources/site-initializer/commerce-catalogs';

async function start() {
    console.log('Processing Commerce products');
    var catalogProducts = {};
    for (const value of commerceContext.getCatalogs()) {
        catalogProducts[value.id] = [];
    }
    catalogProducts = await buildCatalogs(catalogProducts);
    exportProducts(catalogProducts);
}

async function buildCatalogs(catalogProducts) {
    const rows = await getProducts();
    if (rows == null || rows.items == null || rows.items.length <= 0) {
        console.info(`No Commerce products found!`);
        return;
    }
    for (let index = 0; index < rows.items.length; index++) {
        const product = rows.items[index];
        catalogProducts[product.catalogId].push(product);
    }
    return catalogProducts;
}

async function getProducts() {
    const url = `${config.config().liferay.host}/o/headless-commerce-admin-catalog/v1.0/products?page=0&pageSize=999999`;
    return new Promise(function (resolve, reject) {
        var options = {
            'method': 'GET',
            'url': url,
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
}

async function exportProducts(catalogProducts) {
    for (const key in catalogProducts) {
        const id = parseInt(key);
         const catalog = commerceContext.getCatalogById(parseInt(id));
        console.log('Processing products for ' + catalog.name);
        await helper.createFile(JSON.stringify(catalogProducts[key]), rootDir, catalog.filePrefix + ".products.json");
    }
}

async function downloadProductImages(catalogName) {
    await helper.checkFolder(`${rootDir}/${catalogName}`)
    console.log(`${rootDir}/${catalogName}`);
}

module.exports = {
    start
}
