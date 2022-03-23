/**
 * @author Mahmoud Hussein Tayem
 * @description in this file you will be injecting your exporting jobs, make sure to follow 
 * the same pattern and to make your start method async method
 */
const thumbnail = require('./thumbnail');
const webcontent = require('./webContentStructure.js');
const documents = require('./documents');
const vocabularies = require('./vocabularies');
const fragments = require('./fragments');

function start()
{
    thumbnail.start();
    vocabularies.start();
    webcontent.start(); 
    documents.start();
    fragments.start();
}

module.exports = {
    start
}