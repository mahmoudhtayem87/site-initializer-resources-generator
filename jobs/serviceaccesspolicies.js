/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all of the Service Access Policies and
 * store them in the site initializer required format
 */
var dir = './output/resources/site-initializer/';
const applications = require('../services/applications');
const config = require('../config');
const helper = require('../helper');
fs = require('fs');


async function createFile(filedata, filename) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    fs.writeFile(`${dir}/${filename}`, filedata.toString(), function (err) {
        if (err) return console.error(err);
    });
}

function getAllowedServiceSignatures(data)
{
    if(data.indexOf('\n') != -1)
    {
        allowedServiceSignatures = data.split("\n");
        return allowedServiceSignatures;
    }
    else
        return data;
}
async function processSAPs(items)
{
    var _items = [];
    for(let index = 0 ; index < items.length ; index++)
    {
        var item = items[index];
        var sap = {
            "allowedServiceSignatures": getAllowedServiceSignatures(item.allowedServiceSignatures),
            "defaultSAPEntry": item.defaultSAPEntry,
            "enabled": item.enabled,
            "name": item.name,
            "title_i18n": helper.getNameTree(item.title)
        };
        _items.push(sap);
    }
    await createFile(JSON.stringify(_items),"sap-entries.json");
}
async function start() {

    var saps = await applications.getServiceAccessPolicies();
    processSAPs(saps);
}

module.exports = {
    start
}



