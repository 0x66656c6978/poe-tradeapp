const fs = require('fs')
const path = require('path')


function Parser() {
}

// maybe needed later to map mods to their respective mod id's
// const itemStats = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'stats.json'), 'utf8'))

const ITEM_SECTION_SEPARATOR = '\n--------\n'

function isNotEmptyLine(line) {
    return !!line
}

function splitLines(chunk) {
    return chunk.split('\n').filter(isNotEmptyLine).map(function (line) {
        return line.trim()
    });
}

function getNextChunkLines(chunks) {
    const lines = splitLines(chunks[0])
    chunks.splice(0, 1)
    return lines
}

Parser.parseItemText = function (clipboardContent) {
    let chunks = clipboardContent.split(ITEM_SECTION_SEPARATOR)
    let isFracturedItem = false
    let isAbyssJewel = false
    let isAbyssItem = false
    let isShaperItem = false
    let isElderItem = false
    let isSynthesisedItem = false

    let requirementsChunk = null
    let noteChunk = null
    let socketChunk = null
    let helpChunk = null

    // filter out the note chunk and the fracture item / synthesized item
    chunks = chunks.filter(function (chunk) {
        if (chunk.startsWith('Note:')) {
            noteChunk = splitLines(chunk)
            return false;
        }
        if (chunk.startsWith('Requirements:')) {
            requirementsChunk = splitLines(chunk)
            return false;
        }
        if (chunk.startsWith('Sockets:')) {
            socketChunk = splitLines(chunk)
            return false;
        }
        if (chunk.trim() === 'Fractured Item') {
            isFracturedItem = true;
            return false;
        }
        if (chunk.trim() === 'Abyss') {
            isAbyssItem = true;
            return false;
        }
        if (chunk.trim() === 'Shaper Item') {
            isShaperItem = true;
            return false;
        }
        if (chunk.trim() === 'Elder Item') {
            isElderItem = true;
            return false;
        }
        if (chunk.trim() === 'Synthesised Item') {
            isSynthesisedItem = true;
            return false;
        }
        if (chunk.startsWith('Place into an Abyssal Socket')) {
            isAbyssJewel = true
            return false;
        }
        return true;
    })

    let itemTypeChunk = null
    let itemAttributesChunk =null
    let itemLevelChunk = null
    let implicitChunk = null
    let explicitChunk = null

    itemTypeChunk = getNextChunkLines(chunks)
    if (!itemTypeChunk[0].startsWith('Rarity:'))
        throw new Error('Item Rarity chunk is missing')

    itemAttributesChunk = getNextChunkLines(chunks)
    if (itemAttributesChunk[0].startsWith('Item Level:')) {
        itemLevelChunk = itemAttributesChunk
        itemAttributesChunk = null
    } else {
        itemLevelChunk = getNextChunkLines(chunks)
        if (!itemLevelChunk[0].startsWith('Item Level:')) {
            itemLevelChunk = getNextChunkLines(chunks)
        }
    }


    let itemBaseName = null
    let itemLevel = null
    let itemSubType = null
    let fracturedMods = []
    let sockets = null
    let requirements = null
    let note = null
    let attributes = null
    let rarity = null
    let helpText = null

    itemRarityChunks = itemTypeChunk[0].split(': ')
    rarity = itemRarityChunks[1]

    if (chunks.length) {
        if (rarity === 'Normal') {
            implicitChunk = getNextChunkLines(chunks)
        } else {
            if (chunks.length > 1) {
                implicitChunk = getNextChunkLines(chunks)
                explicitChunk = getNextChunkLines(chunks)
            } else {
                explicitChunk = getNextChunkLines(chunks)
            }
        }
    }

    if (itemTypeChunk[0] === 'Rarity: Rare') {
        itemBaseName = itemTypeChunk[2]
    } else {
        itemBaseName = itemTypeChunk[1]
    }

    if (socketChunk) {
        sockets = socketChunk[0].split(': ')[1]
    }

    if (itemAttributesChunk) {
        let itemAttributeChunksWithoutType = itemAttributesChunk
        if (itemAttributesChunk[0].indexOf(':') === -1) {
            itemSubType = itemAttributesChunk[0]
            itemAttributeChunksWithoutType = itemAttributesChunk.slice(1)
        }
        attributes = itemAttributeChunksWithoutType.reduce(function (obj, line) {
            const lineChunks = line.split(': ')
            obj[lineChunks[0]] = lineChunks[1]
            return obj
        }, {})
    }

    if (requirementsChunk) {
        requirements = requirementsChunk.slice(1).reduce(function (obj, line) {
            const lineChunks = line.split(': ')
            obj[lineChunks[0]] = lineChunks[1]
            return obj
        }, {})
    }

    if (noteChunk) {
        note = noteChunk[0].replace('Note: ', '')
    }

    if (helpChunk) {
        helpText = helpChunk[0]
    }

    const itemLevelStrChunks = itemLevelChunk[0].split(':')
    itemLevel = parseInt(itemLevelStrChunks[1].trim())
    
    if (isNaN(itemLevel))
        throw new Error('Item Level isNaN')

    if (explicitChunk) {
        for (var i = 0; i < explicitChunk.length; i++) {
            var explicitMod = explicitChunk[i];
            if (explicitMod.endsWith('(fractured)'))
                fracturedMods.push(explicitMod)
        }
    }

    if (rarity === 'Magic') {
        let nameChunks = itemBaseName.split(' ')
        if (explicitChunk.length === 2) { // remove prefix + suffix
            itemBaseName = nameChunks.slice(1).slice(0, nameChunks.length - 3)
        } else {
            if (itemBaseName.match(/of \w+$/)) { // remove suffix
                itemBaseName = nameChunks.slice(0, nameChunks.length - 3)
            } else { // remove prefix
                itemBaseName = nameChunks.slice(1)
            }
        }
        itemBaseName = itemBaseName.join(' ')
    }

    if (itemBaseName.startsWith('Synthesised')) {
        isSynthesisedItem = true
        itemBaseName = itemBaseName.replace('Synthesised ', '')
    }


    const itemDescription = {
        rarity,
        baseName: itemBaseName,
        itemSubType,
        attributes,
        requirements,
        sockets,
        itemLevel,
        implicitMods: implicitChunk || [],
        explicitMods: explicitChunk || [],
        isFracturedItem,
        isAbyssJewel,
        isAbyssItem,
        isShaperItem,
        isElderItem,
        fracturedMods,
        note,
        helpText
    }

    return itemDescription
}


module.exports = Parser;