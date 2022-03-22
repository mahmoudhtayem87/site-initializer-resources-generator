const config = require('../config');
const applications = require('../services/applications');
var dir = './output/resources/site-initializer/taxonomy-vocabularies/group';

//http://localhost:8080/o/api?endpoint=http://localhost:8080/o/headless-admin-taxonomy/v1.0/openapi.json


async function checkFolder() {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
}
async function createFile(filedata, filename) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}`, filedata, function (err) {
        if (err) return console.error(err);
    });
}
async function createVocabulary(vocabulary) {
    console.log("voc: " + vocabulary.name);
    await createFile("{}", vocabulary.name + ".json");
}
async function start() {
    console.log('Creating vocabularies');
    await checkFolder();
    var data = await applications.getVocabularies();
    console.log(data);
    //loop items and create json file and folder
    for (let index = 0; index < data.items.length; index++) {
        const vocabulary = data.items[index];
        createVocabulary(vocabulary);
    }

}

module.exports = {
    start
}
