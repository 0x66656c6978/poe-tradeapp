const {
    clipboard,
} = require('electron')

const PoeClient = require('../poe/Client');
const PoeWebsiteClient = require('../poe/website/Client');
const ItemParser = require('../poe/item/Parser');

const Hotkey = 'CommandOrControl+F'

function ItemSearch(app) {
    this.app = app;
    this.app.registerHotkey(Hotkey, this.onSearch.bind(this))
    this.poeClient = new PoeClient();
    this.websiteClient = new PoeWebsiteClient(this.app.mainWindow);
}

ItemSearch.prototype.onSearch = function () {
    if (!this.poeClient.isWindowActive()) return;
    this.poeClient.sendCtrlC();
    setTimeout(this.doSearch.bind(this), 333);
}

ItemSearch.prototype.doSearch = function () {
    let item = null
    let clipboardContent = clipboard.readText()

    while (clipboardContent.indexOf('\r') !== -1) {
        clipboardContent = clipboardContent.replace('\r', '')
    }

    if (appRef.debug) {
        console.log(clipboardContent)
    }

    try {
        item = ItemParser.parse(clipboardContent)
    } catch(ex) {
        console.error('An error occured validating the clipboard')
        console.error(ex)
        return
    }

    this.poeClient.doSearch(item.getSearchQuery());
}

function createModule(app) {
    return new ItemSearch(app);
}

module.exports = createModule