const thumbnail = require('./thumbnail');
const webcontent = require('./webcontent');
const documents = require('./documents');
const vocabularies = require('./vocabularies');




function start()
{
    thumbnail.start();
    vocabularies.start();
    webcontent.start();
    documents.start();    
}

module.exports = {
    start
}