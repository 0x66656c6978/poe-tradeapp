const {
    clipboard,
} = require('electron')

const PoeClient = require('../poe/Client')
const PoeWebsiteClient = require('../poe/website/Client')
const ItemParser = require('../poe/item/Parser')

const hotkey = 'CommandOrControl+F'
const pollSearchResultInterval = 200 // ms
const maxRetries = 100

class ItemSearch {
    constructor(app) {
        this.app = app
        this.app.registerHotkey(hotkey, this.handleHotkeyPressed.bind(this))
        this.poeClient = new PoeClient()
        this.websiteClient = new PoeWebsiteClient(this.app.mainWindow)
        this.latestSearch = null
        this.retries = 0
    }

    handleHotkeyPressed() {
        this.retries = 0;
        if (!this.poeClient.isWindowActive()) {
            if (this.app.debug) console.info('Path of Exile is not active window.');
            return;
        }
        this.poeClient.sendCtrlC();
        if (this.app.debug) console.info('Set ctrl+c to the game window');
        setTimeout(this.doSearch.bind(this), 333);
    }

    doSearch() {
        if (this.app.debug) console.info('Reading clipboard');
        let item = null
        let searchQuery = null
        let clipboardContent = clipboard.readText()
    
        while (clipboardContent.indexOf('\r') !== -1) {
            clipboardContent = clipboardContent.replace('\r', '')
        }
    
        if (this.app.debug) {
            console.log('---------------- Clipboard ----------------')
            console.log(clipboardContent);
            console.log('----------------    End    ----------------')
        }
    
        try {
            if (this.app.debug) console.info('Parsing clipboard contents')
            item = ItemParser.parse(clipboardContent)
        } catch(ex) {
            console.error('An error occured validating the clipboard')
            console.error(ex)
            return
        }
    
        try {
            if (this.app.debug) console.info('Mapping item to search query')
            searchQuery = item.getSearchQuery()
        } catch(ex) {
            console.error('Mapping item to search query failed')
            console.error(ex)
            return
        }

        this.websiteClient.doSearch(searchQuery)
            .catch(this.handleSearchError.bind(this))
            .then(this.handleSearchSucceeded.bind(this))
    }


    handleSearchError(reason) {
        console.error('Search failed. Reason: ', reason)
    }

    handleSearchSucceeded() {
        var latestSearch = this.websiteClient.getLatestSearch()
        if (this.latestSearch.localId === latestSearch.localId) {
            if (this.retries > maxRetries) {
                console.error('polling latest search results timed out')
                return
            }
            this.retries++
            if (this.app.debug) console.info('Polling latest search update. Retries:', this.retries);
            setTimeout(this.handleSearchSucceeded.bind(this), pollSearchResultInterval)
            return
        }
        this.retries = 0
        this.latestSearch = latestSearch;
        this.handleLatestSearchUpdated();
    }

    handleLatestSearchUpdated() {
        if (this.app.debug) console.info('Latest search updated')
    }
    
}


function createModule(app) {
    return new ItemSearch(app)
}

module.exports = createModule