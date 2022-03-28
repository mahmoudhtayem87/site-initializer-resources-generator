function setup(channelId) {
    global._config.commerceContext = {};
    global._config.commerceContext.catalogMap = new Map();
    global._config.commerceContext.warehouseMap = new Map();
    setChannelId(channelId);
}
function addCatalog(catalog) {
    global._config.commerceContext.catalogMap.set(catalog.id, catalog);
}
function getCatalogById(id) {
    return global._config.commerceContext.catalogMap.get(id);
}
function getCatalogByCode(code) {
    for (const value of getCatalogs()) {
        if (value.code == code) {
            return value;
        }
        return undefined;
    }
}
function getCatalogs() {
    return global._config.commerceContext.catalogMap.values();
}
function addWarehose(warehose) {
    global._config.commerceContext.warehouseMap.set(warehose.name, warehose);
}
function getWarehouseByName(name) {
    return global._config.commerceContext.warehouseMap.get(name);
}
function getWarehouseByCode(code) {
    for (const value of getWarehouses()) {
        if (value.code == code) {
            return value;
        }
        return undefined;
    }
}
function getWarehouses() {
    return global._config.commerceContext.warehouseMap.values();
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
    getCatalogs,
    addWarehose,
    getWarehouseByName,
    getWarehouseByCode,
    getWarehouses
};