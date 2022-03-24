const thumbnail = require('./thumbnail');
const webcontent = require('./webcontent');
const documents = require('./documents');
const channel = require('./commerce-channel');
const catalogs = require('./commerce-catalogs');

function start()
{
    thumbnail.start();
    webcontent.start();
    documents.start();
    channel.start();
    catalogs.start();
}

module.exports = {
    start
}