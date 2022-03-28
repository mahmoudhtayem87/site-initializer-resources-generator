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
        const catalogProduct = catalogProducts[product.catalogId];
        const productEntry = await buildProductEntry(product, catalogProduct);
        catalogProduct.push(productEntry);
    }
    return catalogProducts;
}

async function buildProductEntry(product, catalogProduct) {
    const catalog = commerceContext.getCatalogById(product.catalogId);
    //const imageFilenames = await downloadProductImages(catalog.filePrefix, product.productId)
    return {
        "externalReferenceCode": product.externalReferenceCode,
        "name": await helper.getLocalizedValue(product.name),
        "shortDescription": await helper.getLocalizedValue(product.shortDescription),
        "description": await helper.getLocalizedValue(product.description)
    }
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

async function downloadProductImages(catalogName, productId) {
    console.log('Downloading images for ' + productId);
    await helper.checkFolder(`${rootDir}/${catalogName}`)

    const url = `${config.config().liferay.host}/o/headless-commerce-admin-catalog/v1.0/products/${productId}/images?pageSize=999999`;
    const rows = await new Promise(function (resolve, reject) {
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

    if (rows == null || rows.items == null || rows.items.length <= 0) {
        console.info(`No Commerce images found!`);
        return;
    }
    const imageFilenames = [];
    for (let index = 0; index < rows.items.length; index++) {
        const fileEntry = rows.items[index];
        const filename = await helper.getLocalizedValue(fileEntry.title);
        const srcUrl = new URL(fileEntry.src);
        
        const actualUrl = `${config.config().liferay.host}/${srcUrl.pathname}?download=true`;
        const actualFilename = `${rootDir}/${catalogName}/${filename}`;

        console.log(actualUrl, actualFilename);

        try {
            await helper.downloadFile(actualUrl, actualFilename);
        } catch (exp) {
            fs.unlink(`${actualFilename}`, function (err) {
                if (err) throw err;
            });
            console.error(`Error while downloading image: ${filename}`)
            //console.error(exp);
        }
        imageFilenames.push(filename);
    }
    return imageFilenames;
}

module.exports = {
    start
}
