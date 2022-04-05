/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all the Objects and their Entries and
 * store them in the site initializer required format
 */
var dir = './output/resources/site-initializer/object-definitions/';
const applications = require('../services/applications');
const config = require('../config');
const helper = require('../helper');
const objectRelationships = require('./objectrelationships');

fs = require('fs');


async function createFile(filedata, filename) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    fs.writeFile(`${dir}/${filename}`, filedata.toString(), function (err) {
        if (err) return console.error(err);
    });
}


async function processObject(object) {
    var objectDef = {
        "label": object.label,
        "name": object.name,
        "objectFields":object.objectFields,
        "pluralLabel": object.pluralLabel,
        "scope": object.scope
    };
    var objectFields = [];
    for(var index = 0 ; index < object.objectFields.length ; index++)
    {
        objectFields.push(object.objectFields[index].name);
    }
    createFile(JSON.stringify(objectDef),`${object.name.replace(" ", "-")}.json`);
    if(!object.system)
    {
        var objId = object.id;
        object = await applications.getObjectDefinition(object.id);
        var data = (await applications.getObjectEntires(object.pluralLabelCurrentValue.toLowerCase())).items;
        var dataObjects = [];
        for(var subIndex = 0 ; subIndex < data.length ; subIndex++)
        {
            var item = {};
            for(var keyIndex = 0 ; keyIndex < objectFields.length ; keyIndex++)
            {
                item[objectFields[keyIndex]] = data[subIndex][objectFields[keyIndex]];
            }
            item["objectEntrySiteInitializerKey"] = `objectEntrySiteInitializerKey-${subIndex+1}`;
            dataObjects.push(item);
        }
        createFile(JSON.stringify(dataObjects),`${object.labelCurrentValue.replace(" ", "-")}.object-entries.json`);
        objectRelationships.start(objId);
    }
}

async function start() {
    var objects = (await applications.getObjectDefinitions()).items;
    for (let index = 0; index < objects.length; index++) {
        console.log(`Porcessing object ${objects[index].name}`);
        processObject(objects[index]);
    }
}

module.exports = {
    start
}



