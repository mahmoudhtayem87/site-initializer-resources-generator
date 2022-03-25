/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all of the site pages (public and private) and
 * store them in the site initializer required format
 */
var dir = './output/resources/site-initializer/';
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


async function processSiteConfig(siteConfig)
{

    var config = {
        "manualMembership": siteConfig.manualMembership,
        "membershipRestriction":  siteConfig.membershipRestriction,
        "typeSite": siteConfig.type
    };
    await createFile(JSON.stringify(config),"site-configuration.json");
}
async function start() {

    var siteConfig = await applications.getSiteConfiguration();
    processSiteConfig(siteConfig);

}

module.exports = {
    start
}



