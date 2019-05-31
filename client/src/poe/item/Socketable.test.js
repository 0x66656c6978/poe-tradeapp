import Equippable from './Equippable';
import Item from './Item';
import Socketable from './Socketable';
import { Sockets } from './Sockets';

test('Socketable should be an instance of Item', () => {
    const s = new Socketable();
    expect(s).toBeInstanceOf(Item);
});

test('Socketable should be an instance of Equippable', () => {
    const s = new Socketable();
    expect(s).toBeInstanceOf(Equippable);
});

test('Socketable should have the right properties', () => {
    const s = new Socketable();
    expect(s).toHaveProperty('sockets');
});

test('Socketable.sockets should be an instance of Sockets', () => {
    const s = new Socketable();
    expect(s.sockets).toBeInstanceOf(Sockets);
})