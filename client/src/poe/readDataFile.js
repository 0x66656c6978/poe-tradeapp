import path from 'path';
import fs from 'fs';

module.exports = (dataFileName) => {
    const p = path.join(__dirname, '..', '..', 'data', dataFileName);
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
};
