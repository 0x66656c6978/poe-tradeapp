const fs = require('fs')
const path = require('path')
const glob = require('glob')

const parseItemText = require('../shared/parse-item-text');
const getModIdByText = require('../shared/map-mod-text-to-id');

const testParseItemText = function () {

}

module.exports = function () {
    glob(path.join(__dirname, 'data', 'items', '*.txt'), function (err, matches) {
        matches.forEach(function (filePath) {
            console.log(filePath)
            const itemText = fs.readFileSync(filePath, 'utf-8')
            console.info(itemText)
            const itemDescription = parseItemText(itemText)
            try {
                if (!itemDescription.baseName)
                    throw new Error()
                if (itemDescription.explicitMods.length) {
                    itemDescription.explicitMods.forEach(function (modName) {
                        let modId = getModIdByText(modName)
                        console.log(modName, modId)
                    })
                }
            } catch (e) {
                console.error(e)
            }
        })
    })
}