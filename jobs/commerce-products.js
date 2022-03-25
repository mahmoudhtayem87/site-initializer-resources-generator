/**
 * @author Peter Richards
 * @description this job is used to pull the Commerce products
 */

const rootDir = './output/resources/site-initializer/commerce-catalogs';

async function exportProducts(catalogName) {

}

async function downloadProductImages(catalogName) {
    await helper.checkFolder(`${rootDir}/${catalogName}`)
    console.log(`${rootDir}/${catalogName}`);
}

module.exports = {
    exportProducts
}
