const thumbnail = require('./thumbnail');
const webcontent = require('./webcontent');
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