import {
    Sockets,
    SOCKET_NONE,
    SOCKET_BLUE,
    SOCKET_GREEN,
    SOCKET_RED,
    SOCKET_WHITE,
} from './Sockets';

test('Sockets should have the right properties', () => {
    const s = new Sockets();
    expect(s).toHaveProperty('sockets');
});

test('Sockets', () => {
    const s = new Sockets();
    expect(s.getSocketColor(0)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(1)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(2)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(3)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(4)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(5)).toBe(SOCKET_NONE);

    s.setSocketColor(0, SOCKET_BLUE);
    expect(s.getSocketColor(0)).toBe(SOCKET_BLUE);

    s.clear();
    expect(s.getSocketColor(0)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(1)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(2)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(3)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(4)).toBe(SOCKET_NONE);
    expect(s.getSocketColor(5)).toBe(SOCKET_NONE);

    s.setSocketColor(0, SOCKET_GREEN);
    expect(s.getSocketColor(0)).toBe(SOCKET_GREEN);
    s.setSocketColor(1, SOCKET_BLUE);
    expect(s.getSocketColor(1)).toBe(SOCKET_BLUE);
    s.setSocketColor(2, SOCKET_WHITE);
    expect(s.getSocketColor(2)).toBe(SOCKET_WHITE);
    s.setSocketColor(3, SOCKET_RED);
    expect(s.getSocketColor(3)).toBe(SOCKET_RED);
    s.setSocketColor(4, SOCKET_WHITE);
    expect(s.getSocketColor(4)).toBe(SOCKET_WHITE);
    s.setSocketColor(5, SOCKET_BLUE);
    expect(s.getSocketColor(5)).toBe(SOCKET_BLUE);


    expect(() => {
        s.setSocketColor(1, 25);
    }).toThrow(RangeError);
    expect(() => {
        s.setSocketColor(55, SOCKET_BLUE);
    }).toThrow(RangeError);
    s.setSocketColor(0, SOCKET_GREEN);
    s.setSocketColor(1, SOCKET_BLUE);
    s.setSocketColor(2, SOCKET_WHITE);
    s.setSocketColor(3, SOCKET_RED);
    s.setSocketColor(4, SOCKET_WHITE);
    s.setSocketColor(5, SOCKET_BLUE);
    
    s.setLinked(1, 2, 1);
    expect(s.isLinked(1, 2)).toBe(1);
    let links = s.getLinks(1);
    expect(links).toHaveLength(1);
    expect(links[0]).toBe(2);
    
    s.setLinked(1, 2, 0);
    expect(s.isLinked(1,2)).toBe(0);
    links = s.getLinks(1);
    expect(links).toHaveLength(0);
    
    s.setLinked(1, 2, 1);
    expect(s.isLinked(1,2)).toBe(1);
    
    expect(s.isLinked(0,1)).toBe(0);
    
    expect(() => {
        s.setLinked(5, 7, 9)
    }).toThrow(RangeError);
    expect(() => {
        s.setLinked(0, 0, true)
    }).toThrow(RangeError);


    s.setLinked(2, 3, 1);
    s.setLinked(3, 4, 1);
    expect(s.isLinked(2, 3)).toBe(1);
    expect(s.isLinked(3, 4)).toBe(1);
    links = s.getLinks(1);
    expect(links).toHaveLength(3);
    expect(links).toMatchObject([2,3,4]);
    links = s.getLinks(2);
    expect(links).toHaveLength(3);
    expect(links).toMatchObject([1,3,4]);
    links = s.getLinks(3);
    expect(links).toHaveLength(3);
    expect(links).toMatchObject([1,2,4]);
    links = s.getLinks(4);
    expect(links).toHaveLength(3);
    expect(links).toMatchObject([1,2,3]);

    s.clear();

    s.setSocketColor(0, SOCKET_RED);
    s.setSocketColor(1, SOCKET_RED);
    s.setLinked(0, 1, 1);
    s.setSocketColor(2, SOCKET_RED);
    s.setLinked(1, 2, 1);

    s.setSocketColor(3, SOCKET_BLUE);
    s.setSocketColor(4, SOCKET_WHITE);
    s.setLinked(3, 4, 1);

    s.setSocketColor(5, SOCKET_GREEN);

    let groups = s.getSocketGroups();
    expect(groups).toHaveLength(3);
    expect(groups[0]).toMatchObject([0, 1, 2]);
    expect(groups[1]).toMatchObject([3, 4]);
    expect(groups[2]).toMatchObject([5]);

    s.setLinked(1, 2, 0);
    groups = s.getSocketGroups();
    expect(groups).toHaveLength(4);
    expect(groups[0]).toMatchObject([0, 1]);
    expect(groups[1]).toMatchObject([2]);
    expect(groups[2]).toMatchObject([3, 4]);
    expect(groups[3]).toMatchObject([5]);
});

test('Sockets.parseStr', () => {
    let s = Sockets.parseStr('B');
    expect(s.getSocketColor(0)).toBe(SOCKET_BLUE);
    expect(s.getLinks(0)).toHaveLength(0);
    expect(s.getSocketGroups()).toMatchObject([[0]]);
    
    s = Sockets.parseStr('B-R G-G-G W');
    expect(s.getSocketColor(0)).toBe(SOCKET_BLUE);
    expect(s.getSocketColor(1)).toBe(SOCKET_RED);
    expect(s.getSocketColor(2)).toBe(SOCKET_GREEN);
    expect(s.getSocketColor(3)).toBe(SOCKET_GREEN);
    expect(s.getSocketColor(4)).toBe(SOCKET_GREEN);
    expect(s.getSocketColor(5)).toBe(SOCKET_WHITE);
    
    expect(s.isLinked(0, 1)).toBe(1);
    expect(s.isLinked(1, 2)).toBe(0);
    expect(s.isLinked(2, 4)).toBe(1);
    expect(s.isLinked(4, 5)).toBe(0);
    
    expect(s.getLinks(0)).toMatchObject([1]);
    expect(s.getLinks(1)).toMatchObject([0]);
    expect(s.getLinks(2)).toMatchObject([3, 4]);
    expect(s.getLinks(3)).toMatchObject([2, 4]);
    expect(s.getLinks(4)).toMatchObject([2, 3]);
    expect(s.getLinks(5)).toMatchObject([]);

    expect(s.getSocketGroups()).toMatchObject([[0,1], [2,3,4], [5]]);
})