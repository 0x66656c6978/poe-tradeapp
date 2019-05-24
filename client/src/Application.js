const {
    app: electronApp,
    BrowserWindow,
    globalShortcut
} = require('electron')


function Application() {
    this.hotkeyMap = {}
    this.modules = {}
    this.mainWindow = null
    this.debug = /--debug/.test(process.argv[2])
}

if (process.mas) app.setName('TEST')

Application.prototype.initialize = function () {
    this.makeSingleInstance()

    electronApp.on('ready', () => {
        this.createWindow()
        this.loadModules()
    })

    electronApp.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electronApp.quit()
            console.info('shutdown succeeded')
        }
    })

    electronApp.on('activate', () => {
        if (this.mainWindow === null) {
            this.createWindow()
        }
    })

    electronApp.on('will-quit', () => this.uninstallHotkeys())
}

Application.prototype.createWindow = function () {
    const windowOptions = {
        width: 1080,
        minWidth: 680,
        height: 840,
        title: electronApp.getName(),
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
}

Application.prototype.loadModules = function () {
    const modules = require('./modules/modules')
    for (var moduleName in modules)
        this.loadModule(moduleName, modules[moduleName])
}

Application.prototype.loadModule = function (exportName, moduleLoader) {
    this.modules[exportName] = moduleLoader(this);
}

Application.prototype.registerHotkey = function (hotkey, callback) {
    if (hotkey in this.hotkeyMap) return
    this.hotkeyMap[hotkey] = true
    globalShortcut.register(hotkey, callback)
}

Application.prototype.uninstallHotkeys = function () {
    if (this.hotkeyMap) {
        for (var hotkey in this.hotkeyMap) {
            globalShortcut.unregister(hotkey)
        }
    }
}

Application.prototype.makeSingleInstance = function () {
    if (process.mas) return

    electronApp.requestSingleInstanceLock()

    electronApp.on('second-instance', () => {
        if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore()
            this.mainWindow.focus()
        }
    })
}

module.exports = { Application }