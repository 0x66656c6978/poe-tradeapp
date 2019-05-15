const {
    clipboard,
} = require('electron')

const parseItemText = require('../shared/parse-item-text')
const triggerSearchFunc = require('../shared/trigger-search-func')

const Hotkey = 'CommandOrControl+F'

function createSearchQueryFromItemDescription(itemDescription) {
    let itemLevel = itemDescription.itemLevel
    if (itemLevel > 86) {
        itemLevel = 86
    }
    return {
        type: itemDescription.baseName,
        status: {
            option: "online",
        },
        filters: {
            misc_filters: {
                filters: {
                    ilvl: {
                        min: itemLevel,
                    }
                }
            }
        },
        stats: [
            {
                type:"and",
                filters: [
                    {
                        id: "pseudo.pseudo_number_of_fractured_mods",
                        value: {
                            min: itemDescription.fracturedMods.length,
                            max: itemDescription.fracturedMods.length,
                        },
                        disabled: false
                    }
                ],
                disabled: false
            }
        ]
    }
}

function createInjector(func, funcArgs) {
    return `
(function () {
    var executePayload = ${func.toString()};
    executePayload(${JSON.stringify(funcArgs)});
})();
    `;
}

function FracturedItemSearch(app) {
    this.app = app;
    this.app.registerHotkey(Hotkey, this.onFracturedItemSearch.bind(this))
}

FracturedItemSearch.prototype.onFracturedItemSearch = function () {
    let itemDescription = null
    let clipboardContent = clipboard.readText()

    while (clipboardContent.indexOf('\r') !== -1) {
        clipboardContent = clipboardContent.replace('\r', '')
    }

    if (this.app.debug) {
        console.log(clipboardContent)
    }

    try {
        itemDescription = parseItemText(clipboardContent)
    } catch(ex) {
        console.error('An error occured validating the clipboard')
        console.error(ex)
        return
    }

    searchQuery = createSearchQueryFromItemDescription(itemDescription)

    const jsPayload = createInjector(triggerSearchFunc, searchQuery)

    if (this.app.debug) {
        console.log(jsPayload)
    }

    this.app.mainWindow.webContents.executeJavaScript(jsPayload, true)
        .then(this.onSearchSucceed.bind(this))
        .catch(this.onSearchFail.bind(this))
}

FracturedItemSearch.prototype.onSearchSucceed = function (args) {
    if (this.app.debug) {
        console.info('JS executed successfully')
    }
}

FracturedItemSearch.prototype.onSearchFail = function (reason) {
    console.info('Executing search failed')
    console.error(reason)
}

function createModule(app) {
    return new FracturedItemSearch(app);
}

module.exports = createModule