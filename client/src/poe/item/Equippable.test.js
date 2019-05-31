const Item = require('./Item');
const Equippable = require('./Equippable');
const EquippableRequirements = require('./EquippableRequirements');

test('Equippable should be an instance of Item', () => {
    const eq = new Equippable();
    expect(eq).toBeInstanceOf(Item);
});

test('Equippable should have the right properties', () => {
    const eq = new Equippable();
    expect(eq).toHaveProperty('requirements');
    expect(eq.requirements).toBeInstanceOf(EquippableRequirements);
});