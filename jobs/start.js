const thumbnail = require('./thumbnail');
const webcontent = require('./webContentStructure.js');
const documents = require('./documents');




function start()
{
    thumbnail.start();
    webcontent.start();
    documents.start();
}

module.exports = {
    start
}