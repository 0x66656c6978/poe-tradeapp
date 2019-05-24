class Item {

}

Item.prototype.getSearchQuery = function () {
    throw new Error('Not implemented');
};

module.exports = Item;