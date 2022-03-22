
function setup(LRHost,LRUser,LRPassword)
{
    global._config.liferay.host=LRHost;
    global._config.liferay.user=LRUser;
    global._config.liferay.password=LRPassword;
}

function setSiteId(siteId)
{
    global._config.siteId = siteId;
}
function setFriendlyUrlPath(friendlyUrlPath)
{
    global._config.friendlyUrlPath = friendlyUrlPath;
}
function config()
{
    return global._config;
}
module.exports = {
    config,
    setup,
    setSiteId,
    setFriendlyUrlPath
};