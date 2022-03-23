function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}
function replaceSpace(item)
{
    return item.split(' ').join('-');
}
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

module.exports = {
    getOffset,
    replaceSpace,
    emptyOrRows
}