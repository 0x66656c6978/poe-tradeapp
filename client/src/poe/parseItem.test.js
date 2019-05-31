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
import Socketable from './item/Socketable';
import Weapon from './item/Weapon';

import parseItem from './parseItem';

import os from 'os';
import path from 'path';
import fs from 'fs';
import glob from 'glob';

const dataPath = path.join(__dirname, '..', '..', 'data', 'items');

const expectedItemTypes = {
    'armour': Armour,
    'beast': Beast,
    'breachsplinter': BreachSplinter,
    'breachstone': BreachStone,
    'currency': Currency,
    'divinationcard': DivinationCard,
    'essence': Essence,
    'flask': Flask,
    'fossil': Fossil,
    'fragment': Fragment,
    'jewel': Jewel,
    'jewellery': Jewellery,
    'map': MapItem,
    'prophecy': Prophecy,
    'resonator': Resonator,
    'scarab': Scarab,
    'skillgem': SkillGem,
    'weapon': Weapon
}

function testItemByType(itemText, expectedType) {

}

const dirNames = fs.readdirSync(dataPath);
for (let i = 0; i < dirNames.length; ++i) {
  const dirName = dirNames[i];
  const expectedType = expectedItemTypes[dirName];
  const fileNames = fs.readdirSync(path.join(dataPath, dirName));
  for (let j = 0; j < fileNames.length; ++j) {
    const fileName = fileNames[j];
    const filePath = path.join(dataPath, dirName, fileName);
    const itemText = fs.readFileSync(filePath, 'utf-8');
    test(`parseItem. Type: ${expectedType.name}, path: ${filePath}`, () => {
      const item = parseItem(itemText);
      expect(item).toBeInstanceOf(expectedType);
      testItemByType(item, expectedType.name);
    })
  }
}
