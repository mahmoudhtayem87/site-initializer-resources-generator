/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all of the Pick Lists and their Entries and
 * store them in the site initializer required format
 */
var dir = './output/resources/site-initializer/list-type-definitions/';
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


async function processPickList(picklist) {
    var entires = await applications.getPickListEntires(picklist.listTypeDefinitionId);
    var data = [];
    var fileName = picklist.nameCurrentValue.replace(" ","-");
    for(var index = 0 ; index < entires.length ; index++)
    {
        var item = {
                "key": entires[index].key,
                "name": entires[index].nameCurrentValue,
                "name_i18n": await helper.getNameTree(entires[index].name),
                "type": "string"
            };
        data.push(item);
    }
    createFile(JSON.stringify(data),`${fileName}.list-type-entries.json`);
}

async function start() {
    var pickLists = await applications.getPickLists();
    for (let index = 0; index < pickLists.length; index++) {
        console.log(`Porcessing list ${fileName}`)
        var fileName = pickLists[index].nameCurrentValue.replace(" ","-");
        var listdef = {
            name: pickLists[index].nameCurrentValue,
            name_i18n: await helper.getNameTree(pickLists[index].name)
        };
        createFile(JSON.stringify(listdef),`${fileName}.json`);
        processPickList(pickLists[index]);
    }
}

module.exports = {
    start
}



