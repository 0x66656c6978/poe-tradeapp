import Item from './Item';

test('Item should have the right properties', () => {
    const item = new Item();
    expect(item).toHaveProperty('rarity');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('subName');
    expect(item).toHaveProperty('itemLevel');
});