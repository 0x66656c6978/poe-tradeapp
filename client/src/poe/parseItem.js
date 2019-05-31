import readDataFile from './readDataFile';

import Item from './item/Item';
import Armour from './item/Armour';
import Beast from './item/Beast';
import BreachSplinter from './item/BreachSplinter';
import BreachStone from './item/BreachStone';
import Currency from './item/Currency';
import DivinationCard from './item/DivinationCard';
import Essence from './item/Essence';
import Flask from './item/Flask';
import Fossil from './item/Fossil';
import Fragment from './item/Fragment';
import Jewel from './item/Jewel';
import Jewellery from './item/Jewellery';
import MapItem from './item/Map';
import Prophecy from './item/Prophecy';
import Resonator from './item/Resonator';
import Scarab from './item/Scarab';
import SkillGem from './item/SkillGem';
import Weapon from './item/Weapon';

const fragmentNames = [
  'Fragment of the Chimera',
  'Fragment of the Hydra',
  'Fragment of the Minotaur',
  'Fragment of the Phoenix',
  'Eber\'s Key',
  'Inya\'s Key',
  'Volkuur\'s Key',
  'Yriel\'s Key',
  'Mortal Grief',
  'Mortal Hope',
  'Mortal Ignorance',
  'Mortal Rage',
  'Offering to the Goddess',
  'Divine Vessel',
  'Sacrifice at Dawn',
  'Sacrifice at Dusk',
  'Sacrifice at Midnight',
  'Sacrifice at Noon',
];

const typeIdentifiers = [
  [
    "Right-click to add this to your bestiary.",
    Beast
  ],
  [
    "Right-click to add this prophecy to your character.",
    Prophecy
  ]
];

/**
 * Retreive a map of all maps and their tiers from maps.json
 *
 * @return Array
 */
function getMapBases() {
  return readDataFile('maps.json');
}

/**
 * Retreive a map of all item bases and their respective types from maps.json
 *
 * @return Array
 */
function getItemBases() {
  return readDataFile('item_bases.json');
}

const mapBases = getMapBases();
const itemBases = getItemBases();
const itemTypeMap = {
  "Wand": Weapon,
  "Ring": Jewellery,
  "Boots": Armour,
  "One Handed Mace": Weapon,
  "Body Armour": Armour,
  "Helmet": Armour,
  "Gloves": Armour,
  "Belt": Jewellery,
  "Bow": Weapon,
  "Claw": Weapon,
  "Shield": Armour,
  "Two Handed Axe": Weapon,
  "Dagger": Weapon,
  "One Handed Sword": Weapon,
  "Two Handed Sword": Weapon,
  "Two Handed Mace": Weapon,
  "One Handed Axe": Weapon,
  "Amulet": Jewellery,
  "Staff": Weapon,
  "Quiver": Weapon,
  "Jewel": Jewel,
}

/** @var {String} */
const ITEM_SECTION_SEPARATOR = '\n--------\n'

/**
 * Returns true if line is empty, false if it contains at least one character
 *
 * @param {String} line
 * @return {Boolean}
 */
function isNotEmptyLine(line) {
  return !!line
}

/**
 * Split the lines in the given chunk of text and trim each line of whitespace on both ends.
 *
 * @param {String} chunk
 * @return {Array}
 */
function splitLines(chunk) {
  return chunk.split('\n').filter(isNotEmptyLine).map(function (line) {
    return line.trim()
  });
}

function parseDivinationCard(chunks, rarity, name, subName, itemLevel) {
  const item = new DivinationCard();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseGem(chunks, rarity, name, subName, itemLevel) {
  const item = new SkillGem();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseMap(chunks, rarity, name, subName, itemLevel, mapName) {
  const mapTier = mapBases[mapName];
  const item = new MapItem();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseItem(chunks, rarity, name, subName, itemLevel, itemBaseName) {
  if (!(itemBaseName in itemBases))
    throw new Error(`Invalid item base ${itemBaseName}`);
  const itemSubType = itemBases[itemBaseName];
  if (!(itemSubType in itemTypeMap))
    throw new Error(`Item sub type ${itemSubType} for item base ${itemBaseName} doesn't have a corresponding item type`);
  const itemType = itemTypeMap[itemSubType];
  const item = new itemType();
  return item;
}

function parseFragment(chunks, rarity, name, subName, itemLevel) {
  const item = new Fragment();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseFossil(chunks, rarity, name, subName, itemLevel) {
  const item = new Fossil();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseResonator(chunks, rarity, name, subName, itemLevel) {
  const item = new Resonator();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseBreachstone(chunks, rarity, name, subName, itemLevel) {
  const item = new BreachStone();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseFlask(chunks, rarity, name, subName, itemLevel) {
  const item = new Flask();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseJewel(chunks, rarity, name, subName, itemLevel) {
  const item = new Jewel();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseBeast(chunks, rarity, name, subName, itemLevel) {
  const item = new Beast();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseProphecy(chunks, rarity, name, subName, itemLevel) {
  const item = new Prophecy();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseScarab(chunks, rarity, name, subName, itemLevel) {
  const item = new Scarab();
  item.rarity = rarity;
  item.name = name;
  item.subName = subName;
  item.itemLevel = itemLevel;
  return item;
}

function parseCurrency(chunks, name, stackSize) {
  const item = new Currency();
  item.rarity = 'Currency';
  item.name = name;
  return item;
}

function parseEssence(chunks, name, stackSize) {
  const item = new Essence();
  item.rarity = 'Currency';
  item.name = name;
  return item;
}

function parseBreachSplinter(chunks, name, stackSize) {
  const item = new BreachSplinter();
  item.rarity = 'Currency';
  item.name = name;
  return item;
}



function parseItemNew(itemText) {
  const chunks = itemText.split(ITEM_SECTION_SEPARATOR);
  const header = splitLines(chunks[0]);
  const rarity = header[0].split('Rarity: ')[1];
  const mapNames = Object.keys(mapBases);
  const itemBaseNames = Object.keys(itemBases);
  let subName = null
  let name = null
  let itemLevel = null
  const itemLevelChunks = chunks.filter(function (chunk) {
    return /Item Level\: \d+\n/.test(chunk);
  });
  if (itemLevelChunks.length) {
    const itemLevelLines = splitLines(itemLevelChunk[0]);
    itemLevel = parseInt(itemLevelLines[0].replace('Item Level: ', ''));
    if (isNaN(itemLevel)) {
        throw new Error('Parsing Item-Level failed');
    }
  }
  switch(rarity) {
    case 'Normal':
    case 'Magic':
    case 'Rare':
    case 'Unique':
      if (rarity == 'Normal' || rarity == 'Magic') {
        name = header[1];
      } else {
        subName = header[1];
        name = header[2];
      }
      if (!name) {
        throw new Error(`Could not parse name. Header: ${header}`)
      }
      if (name.endsWith(' Breachstone')) {
        return parseBreachstone(chunks, rarity, name, subName, itemLevel);
      }
      if (name.endsWith(' Scarab')) {
        return parseScarab(chunks, rarity, name, subName, itemLevel);
      }
      if (name.indexOf(' Flask') !== -1) {
        return parseFlask(chunks, rarity, name, subName, itemLevel);
      }
      if (fragmentNames.indexOf(name) !== -1) {
        return parseFragment(chunks, rarity, name, subName, itemLevel);
      }
      for (let i = 0; i < mapNames.length; ++i) {
        const mapName = mapNames[i];
        if (name.indexOf(mapName) !== -1)
          return parseMap(chunks, rarity, name, subName, itemLevel, mapName);
      }
      for (let i = 0; i < itemBaseNames.length; ++i) {
        const itemBase = itemBaseNames[i];
        if (name.indexOf(itemBase) !== -1)
          return parseItem(chunks, rarity, name, subName, itemLevel, itemBase);
      }
      for (let i = 1; i < chunks.length; ++i) {
        const chunk = chunks[i];
        const chunkLines = splitLines(chunk);
        for (let j = 0; j < chunkLines.length; ++j) {
          const line = chunkLines[j];
          for (let k = 0; k < typeIdentifiers.length; ++k) {
            const identifier = typeIdentifiers[k];
            if (line.indexOf(identifier[0]) !== -1) {
              if (identifier[1] === Beast) {
                return parseBeast(chunks, rarity, name, subName, itemLevel);
              } else if (identifier[1] === Prophecy) {
                return parseProphecy(chunks, rarity, name, subName, itemLevel);
              }
            }
          }
        }
      }
    break;
    case 'Currency':
      name = header[1];
      let stackSize = null;
      const stackSizeChunks = chunks.filter(function (chunk) {
        return /Stack Size\: \d+\n/.test(chunk);
      });
      if (stackSizeChunks.length) {
        const stackSizeLines = splitLines(stackSizeChunks[0]);
        stackSize = parseInt(stackSizeLines[0].replace('Stack Size: ', ''));
        if (isNaN(stackSize)) {
          throw new Error('Parsing Stack Size failed');
        }
      }
      if (name.startsWith('Splinter of ')) {
        return parseBreachSplinter(chunks, name, stackSize);
      }
      if (name.endsWith(' Fossil')) {
        return parseFossil(chunks, rarity, name, subName, itemLevel);
      }
      if (name.endsWith(' Resonator')) {
        return parseResonator(chunks, rarity, name, subName, itemLevel);
      }
      if (/^\w+ Essence of \w+$/.test(name)) {
        return parseEssence(chunks, name, stackSize);
      }
      return parseCurrency(chunks, name, stackSize);
    case 'Divination Card':
      return parseDivinationCard(chunks);
    case 'Gem':
      return parseGem(chunks);
    default:
      throw new Error(`Invalid rarity: ${rarity}`);
  }
  throw new Error('Could not parse item');
}


module.exports = parseItemNew;
