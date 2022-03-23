const config = require('../config');
const applications = require('../services/applications');
var dir = './output/resources/site-initializer/taxonomy-vocabularies/group';

//http://localhost:8080/o/api?endpoint=http://localhost:8080/o/headless-admin-taxonomy/v1.0/openapi.json


async function createFolder(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
}
async function createFile(filedata, filename, dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}`, filedata, function (err) {
        if (err) return console.error(err);
    });
}
async function createVocabulary(vocabulary) {
    console.log("voc: " + vocabulary.name);
    let vocJson = {
        "description": vocabulary.description,
        "externalReferenceCode": vocabulary.name.toUpperCase().replace(/\s/g, ''),
        "name": vocabulary.name,
        "viewableBy": "Anyone"
    };
    await createFile(JSON.stringify(vocJson), vocabulary.name.toLowerCase() + ".json",dir);
    const vocabularyDir = dir + "/" + vocabulary.name.toLowerCase();
    await createFolder(vocabularyDir);
    await createCategories(vocabularyDir,vocabulary.id);
}
async function createCategories(dir, vocabularyId) {
    var data = await applications.getCategories(vocabularyId);
    console.log(data);
    for (let index = 0; index < data.items.length; index++) {
        const category = data.items[index];
        if (category.numberOfTaxonomyCategories > 0) {
            // create folder for children
            await createFolder(dir + "/" + category.name);
            // TODO call recursive/traversing function
        }
        // create json
        let categoryJson = {
            "description": category.description,
            "externalReferenceCode": category.name.toUpperCase().replace(/\s/g, ''),
            "name": category.name,
            "viewableBy": "Anyone"
        };
        createFile(JSON.stringify(categoryJson), category.name + ".json",dir);
    }
}
async function start() {
    console.log('Creating vocabularies');
    await createFolder(dir);
    var data = await applications.getVocabularies();

    //loop items and create json file and folder
    for (let index = 0; index < data.items.length; index++) {
        const vocabulary = data.items[index];
        await createVocabulary(vocabulary);
        
    }

}

module.exports = {
    start
}