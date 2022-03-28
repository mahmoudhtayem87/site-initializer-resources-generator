/**
 * @author Peter Richards
 * @description this job is used to pull the Commerce warehouses
 */
const request = require('request');

const applications = require('../services/applications');

const config = require('../config');
const helper = require('../helper');
const commerceContext = require('../commerceContext');

const rootDir = './output/resources/site-initializer';

async function start() {
    await helper.checkFolder(rootDir);
    var rows = await applications.getCommerceWarehouses();
    if (rows == null) {
        console.info(`No Commerce warehouses found!`);
        return;
    }
    console.log("Processing Commerce warehouses");
    var warehousesData = [];
    for (let index = 0; index < rows.items.length; index++) {
        const element = rows.items[index];
        commerceContext.addWarehose({
            "name": element.name,
            "code": element.externalReferenceCode,
            "index": index
        });
        warehousesData.push({
            "active": element.active,
            "city": element.city,
            "country": element.countryISOCode,
            "description": element.description,
            "externalReferenceCode": element.externalReferenceCode,
            "latitude": element.latitude,
            "longitude": element.longitude,
            "name": element.name,
            "region": element.regionCode,
            "street1": element.street1,
            "street2": element.street2,
            "street3": element.street3,
            "zip": element.zip
        });
    }
    await helper.createFile(JSON.stringify(warehousesData), rootDir, "commerce-inventory-warehouses.json");
}

module.exports = {
    start
  }