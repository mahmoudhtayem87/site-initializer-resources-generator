function setup(channelId) {
    global._config.commerceContext = {};
    global._config.commerceContext.catalogMap = new Map();
    setChannelId(channelId);
}
function addCatalog(catalog) {
    global._config.commerceContext.catalogMap.set(catalog.id, catalog);
}
function getCatalogById(id) {
    return global._config.commerceContext.catalogMap.get(id);
}
function getCatalogByCode(code) {
    for (const value of global._config.commerceContext.catalogMap.values()) {
        if (value.code == code) {
            return value;
        }
        return undefined;
    }
}
function setChannelId(channelId)
{
    global._config.commerceContext.channelId = channelId;
}
function context()
{
    return global._config.commerceContext;
}
module.exports = {
    setup,
    context,
    setChannelId,
    addCatalog,
    getCatalogById,
    getCatalogByCode,
    showMap
};