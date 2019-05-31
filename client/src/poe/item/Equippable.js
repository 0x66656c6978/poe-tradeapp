const Item = require('./Item');
const EquippableRequirements = require('./EquippableRequirements');

class Equippable extends Item {
    constructor() {
        super();
        this.requirements = new EquippableRequirements();
    }
}


module.exports = Equippable;