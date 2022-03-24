/**
 * @author Mahmoud Hussein Tayem
 * @description in this file you will be injecting your exporting jobs, make sure to follow 
 * the same pattern and to make your start method async method
 */
const thumbnail = require('./thumbnail');
const webcontent = require('./webContentStructure.js');
const documents = require('./documents');
const layout = require('./layout');
const fragments = require('./fragments');
const widget = require('./widgetTemplate.js');
const applications = require('../services/applications');
const config = require('../config');
async function start() {

    await setupUserInformation();
    widget.start();
    layout.start();
    thumbnail.start();
    webcontent.start();
    documents.start();
    fragments.start();
}
async function setupUserInformation() {
    var currentAccount = await applications.getMyUser();
    var userAccount = await applications.getUserAccountJSONAPIs(currentAccount.id);
    config.setUserId(currentAccount.id);
    config.setCompanyId(userAccount.companyId);
}
module.exports = {
    start
}