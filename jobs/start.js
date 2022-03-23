const thumbnail = require('./thumbnail');
const webcontent = require('./webContentStructure.js');
const documents = require('./documents');
const fragments = require('./fragments');

function start()
{
    thumbnail.start();
    webcontent.start();
    documents.start();
    fragments.start();
}

module.exports = {
    start
}