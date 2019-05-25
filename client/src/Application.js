const {
    app,
    BrowserWindow,
    globalShortcut
} = require('electron')
const ItemParser = require('./poe/item/Parser');
const PoeClient = require('./poe/Client');
const PoeWebsiteClient = require('./poe/website/Client');

if (process.mas) app.setName('TEST')

class Application {

    mainWindow = null
    websiteClient = null
    poeClient = new PoeClient()
    debug = /--debug/.test(process.argv[2])

    initialize() {
        this.makeSingleInstance()

        app.on('ready', () => {
            this.createWindow()
        })
    
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
                if (this.debug) console.info('shutdown succeeded')
            }
        })
    
        app.on('activate', () => {
            if (this.mainWindow === null) {
                this.createWindow()
            }
        })
    }

    createWindow() {
        const windowOptions = {
            width: 1080,
            minWidth: 680,
            height: 840,
            title: app.getName(),
        }
    
        this.mainWindow = new BrowserWindow(windowOptions)
        
        if (this.debug) {
            // Launch fullscreen with DevTools open, usage: npm run debug
            this.mainWindow.webContents.openDevTools()
            this.mainWindow.maximize()
        }
        this.mainWindow.on('closed', () => {
            this.mainWindow = null
        })
        const ret = globalShortcut.register('CommandOrControl+F', () => {
            this.handleHotkeyPressed();
        });
        if (!ret) {
            console.error('Hotkey registration failed');
            return
        }
        app.on('will-quit', () => globalShortcut.unregister('CommandOrControl+F'));
        this.websiteClient = new PoeWebsiteClient(this.mainWindow)
        this.websiteClient.initialize();
    }

    handleHotkeyPressed() {
        this.retries = 0;
        if (!this.poeClient.isWindowActive()) {
            if (this.app.debug) console.info('Path of Exile is not active window.');
            return;
        }
        if (!this.websiteClient) return;
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

    makeSingleInstance() {
        if (process.mas) return
    
        app.requestSingleInstanceLock()
    
        app.on('second-instance', () => {
            if (this.mainWindow) {
            if (this.mainWindow.isMinimized()) this.mainWindow.restore()
                this.mainWindow.focus()
            }
        })
    }
}


module.exports = Application