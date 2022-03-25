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
    for(let index = 0 ; index < accounts.length ; index++)
    {
        var account = {
            "accountBriefs": accounts[index].accountBriefs,
            "alternateName": accounts[index].alternateName,
            "emailAddress": accounts[index].emailAddress,
            "familyName":  accounts[index].familyName,
            "givenName": accounts[index].givenName,
            "name": accounts[index].name
        };
        _account.push(account);
    }
    await createFile(JSON.stringify(_account),"user-accounts.json");
}
async function start() {

    var accounts = await applications.getUsersAccounts();
    processUsersAccounts(accounts.items);

}

module.exports = {
    start
}



