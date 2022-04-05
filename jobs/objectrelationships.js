/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all the Objects and their Entries and
 * store them in the site initializer required format
 */
var dir = './output/resources/site-initializer/object-relationships/';
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


async function processObjectRelationship(object) {
    var objectDefinitionId1 = (await applications.getObjectDefinition(object.objectDefinitionId1)).labelCurrentValue;
    var objectDefinitionId2 =  (await applications.getObjectDefinition(object.objectDefinitionId2)).labelCurrentValue;
    var objectDef = {
        "deletionType": object.deletionType,
        "label":object.label,
        "name": object.name,
        "objectDefinitionId1": `[$OBJECT_DEFINITION_ID:${objectDefinitionId1}$]`,
        "objectDefinitionId2": `[$OBJECT_DEFINITION_ID:${objectDefinitionId2}$]`,
        "objectDefinitionName2": object.objectDefinitionName2,
        "type": object.type
    };
    createFile(JSON.stringify(objectDef),`${object.name.replace(" ", "-")}.json`);
}

async function start(objectDefinitionId) {
    var Relationships = (await applications.getObjectRelationships(objectDefinitionId)).items;
    for (let index = 0; index < Relationships.length; index++) {
        processObjectRelationship(Relationships[index]);
    }
}

module.exports = {
    start
}



