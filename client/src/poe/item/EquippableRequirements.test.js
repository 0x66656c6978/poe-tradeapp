import EquippableRequirements from './EquippableRequirements';

test('EquippableRequirements should have the right properties', () => {
    const eq = new EquippableRequirements();
    expect(eq).toHaveProperty('level');
    expect(eq).toHaveProperty('dex');
    expect(eq).toHaveProperty('int');
    expect(eq).toHaveProperty('str');
});