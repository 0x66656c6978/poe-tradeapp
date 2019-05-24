const path = require('path')
const fs = require('fs')

const statsFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'stats.json'), 'utf-8'))
function modTextPatternToRegex(pattern) {
    pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    while (pattern.indexOf('#') !== -1) {
        pattern = pattern.replace(/#/g, '(\\d|\.)+')
    }
    var rx = new RegExp(pattern)
    return rx
}

function getModIdByText(text) {
    var labels = {};
    var possibleMatches = []
    let originalText = text
    text = text.replace(' (fractured)', '')
    for (var i = 0; i < statsFile.result.length; i++) {
        var category = statsFile.result[i];
        labels[category.label] = true
        if (category.label === 'Pseudo') continue;
        if (category.label === 'Monster') continue;
        for (var j = 0; j < category.entries.length; j++) {
            const rx = modTextPatternToRegex(category.entries[j].text)
            if(rx.test(text)) {
                possibleMatches.push(category.entries[j])
            }
        }
    }
    if (possibleMatches.length > 0) {
        for (var i = 0; i < possibleMatches.length; i++) {
            var match = possibleMatches[i];
            if (match.type === 'fractured' && originalText.indexOf(' (fractured)') !== -1) return match.id
        }
    }
    return possibleMatches[0].id
}

/**
  Pseudo: true,
  Explicit: true,
  Implicit: true,
  Fractured: true,
  Enchant: true,
  Crafted: true,
  Veiled: true,
  Monster: true,
  Delve: true 
 */

module.exports = getModIdByText