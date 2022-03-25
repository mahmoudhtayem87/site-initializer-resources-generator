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


 async function processRoles(roles) {
    var _roles = [];
    for (let index = 0; index < roles.length; index++) {
        var role = {
            "actions": [],
            "name": roles[index].name,
            "scope": 1,
            "type": roles[index].type,
        };
        _roles.push(role);
    }
    await createFile(JSON.stringify(_roles), "roles.json");

}

async function start() {

    var _roles = [];
    for (let index = 1; index < 7; index++) {

        var roles = await applications.getRoles(index);
        for(let sub = 0 ; sub < roles.length ; sub++)
        {
            _roles.push(roles[sub]);
        }
    }
    processRoles(_roles);
}

module.exports = {
    start
}



