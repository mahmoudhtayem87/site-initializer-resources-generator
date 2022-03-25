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


async function processUsersAccounts(accounts)
{
    var _account = [];
    var _roles = [];
    for(let index = 0 ; index < accounts.length ; index++)
    {
        //get user account
        var account = {
            "accountBriefs": accounts[index].accountBriefs,
            "alternateName": accounts[index].alternateName,
            "emailAddress": accounts[index].emailAddress,
            "familyName":  accounts[index].familyName,
            "givenName": accounts[index].givenName,
            "name": accounts[index].name
        };
        _account.push(account);
        //get user account roles
        var userRolesData = (await  applications.getUserRoles(accounts[index].id));
        var userJsonRoles = [];
        for(let sub = 0 ; sub < userRolesData.length ; sub++)
        {
            userJsonRoles.push(userRolesData[sub].titleCurrentValue);
        }
        var user_roles = {
                "emailAddress": accounts[index].emailAddress,
                "roles": userJsonRoles
            };
        _roles.push(user_roles);
        userRolesData = [];
    }
    await createFile(JSON.stringify(_roles),"user-roles.json");
    await createFile(JSON.stringify(_account),"user-accounts.json");
}
async function start() {

    var accounts = await applications.getUsersAccounts();
    processUsersAccounts(accounts.items);

}

module.exports = {
    start
}



