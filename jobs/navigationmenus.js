/**
 * @author Mahmoud Hussein Tayem
 * @description this job is used to pull all of the site navigation menus and
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

function processItem(item)
{
    if(item.navigationMenuItems == null || item.navigationMenuItems.length <=0)
        return {
            "friendlyURL": "",
            "privateLayout": false,
            "type": "",
            "name": "",
            "url": ""
        };
    var items = [];
    for(let index = 0 ; index < item.navigationMenuItems.length ; index++)
    {
        if(item.navigationMenuItems[index].navigationMenuItems.length != 0)
        {
            items.push({
                "menuItems": [processItem(item.navigationMenuItems[index])],
                "name": item.navigationMenuItems.name,
                "type": "node"
            });
        }else
        {
            var element = item.navigationMenuItems[index];
            items.push({
                "friendlyURL": element.link,
                "privateLayout": false,
                "type": element.link,
                "name": element.name,
                "url": element.link
            });
        }
    }
    return {
        "menuItems": items,
        "name": item.name,
        "type": "node"
    };

}

async function processNavigationMenus(items)
{
    var _items = [];
    for(let index = 0 ; index < items.length ; index++)
    {
        var item = {
            "menuItems": processItem(items[index]),
            "name": items[index].name
        };
        _items.push(item);
    }
    await createFile(JSON.stringify(_items),"site-navigation-menus.json");
}

async function start() {

    var menus = await applications.getNavigationMenus();
    processNavigationMenus(menus.items);

}

module.exports = {
    start
}