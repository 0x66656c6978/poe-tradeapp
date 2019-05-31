/** @constant {Number} */
const SOCKET_NONE  = 0;
/** @constant {Number} */
const SOCKET_BLUE  = 1
/** @constant {Number} */
const SOCKET_RED   = 2
/** @constant {Number} */
const SOCKET_GREEN = 3
/** @constant {Number} */
const SOCKET_WHITE = 7;

const MAX_SOCKETS = 6;
const SOCKET_SLOT_SIZE = 3;
const SOCKET_SLOT_MASK = 7;
const SOCKET_LINK_OFFSET = MAX_SOCKETS * SOCKET_SLOT_SIZE;
const SOCKET_LINK_SIZE = 1;
const MAX_SOCKET_LINKS = MAX_SOCKETS - 1; 

/**
 * Convert the given socket color string to an integer representing the color
 * 
 * @param {String} socketColorStr Must be a single character
 * @return {Number}
 */
function cvColStr(socketColorStr) {
    if (socketColorStr.length > 1) throw new RangeError();
    switch (socketColorStr) {
        case 'B': return SOCKET_BLUE;
        case 'G': return SOCKET_GREEN;
        case 'R': return SOCKET_RED;
        case 'W': return SOCKET_WHITE;
        default:
            throw new Error(`"${socketColorStr}" invalid socket color`);
    }
}

function colToStr(socketColor) {
    switch (socketColor) {
        case SOCKET_NONE: return '';
        case SOCKET_BLUE: return 'B';
        case SOCKET_GREEN: return 'G';
        case SOCKET_RED: return 'R';
        case SOCKET_WHITE: return 'W';
        default: throw new RangeError();
    }
}

class Sockets {
    constructor() {
        this.sockets = 0;
    }

    /**
     * Clear all sockets and links
     */
    clear() {
        this.sockets = 0;
    }
    
    /**
     * Get the number of sockets
     * 
     * @return {Number}
     */
    getNumSockets() {
        let numSockets = 0;
        for (let i = 0; i < MAX_SOCKETS; i++) {
            if (this.getSocketColor(i) === SOCKET_NONE) break;
            ++numSockets;
        }
        return numSockets;
    }

    /**
     * Get the socket color for the given index
     * 
     * @param {Number} n Index. Must be 0-5
     * @return {Number}
     */
    getSocketColor(n) {
        if (isNaN(parseInt(n, 10))) throw new RangeError();
        if (n < 0 || n > MAX_SOCKETS) throw new RangeError();
        const off = n * SOCKET_SLOT_SIZE;
        return (this.sockets >> off) & SOCKET_SLOT_MASK;
    }

    /**
     * Set the socket color for the given index
     * 
     * @param {Number} n Index. Must be 0-5
     * @param {Number} col Color. Must be one of SOCKET_NONE, SOCKET_BLUE, SOCKET_GREEN or SOCKET_RED
     */
    setSocketColor(n, col) {
        if (isNaN(parseInt(n, 10)) || isNaN(parseInt(col, 10))) throw new RangeError();
        if (n < 0 || n > MAX_SOCKET_LINKS || col < 0 || col > SOCKET_SLOT_MASK) throw new RangeError();
        const numSockets = this.getNumSockets();
        if (n > numSockets) throw new RangeError(`Can only set adjacent socket colors ${n} ${numSockets}`);
        const off = n * SOCKET_SLOT_SIZE;
        const clear_mask = ~(((1 << off) - 1) ^ ((1 << off + SOCKET_SLOT_SIZE) - 1)) >>> 0;
        this.sockets = this.sockets & clear_mask | (col << off);
    }

    /**
     * Link 2 socket slots. They must be next to each other.
     * 
     * @param {Number} a Socket a, Must be 0-5
     * @param {Number} b Socket b, Must be 0-5
     * @param {Boolean} status The linking status. 0 = not linked, 1 = linked
     */
    setLinked(a, b, status) {
        if (isNaN(parseInt(a, 10)) || isNaN(parseInt(b, 10))) throw new RangeError();
        if (b-a != 1) throw new RangeError();
        const clear_mask = ~((1 << SOCKET_LINK_OFFSET + a) -1) ^ ((1 << SOCKET_LINK_OFFSET + b) -1) >>> 0;
        this.sockets = this.sockets & clear_mask | (status << SOCKET_LINK_OFFSET + a);
    }

    /**
     * Get all the indices of sockets linked to this socket
     * 
     * @param {Number} n 
     * @return {Array}
     */
    getLinks(n) {
        if (isNaN(parseInt(n, 10))) throw new RangeError()
        const links = [];
        const numSockets = this.getNumSockets();
        for (let i = 0; i < numSockets - 1; ++i) {
            if (this.isLinked(n, i)) {
                links.push(i);
            }
        }
        return links;
    }

    /**
     * Get all the socket groups.
     * Returns an array where each element is a group represented by an array
     * that contains the socket indices for that group.
     * 
     * @return {Array}
     */
    getSocketGroups() {
        const groups = [];
        const numSockets = this.getNumSockets();
        let currentGroup = [];
        for (let i = 0; i < numSockets; ++i) {
            currentGroup.push(i);
            if (!this.isLinked(i, i+1)) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        }
        return groups;
    }

    /**
     * Return true if socket `begin` and `end` are fully linked.
     * That means that every socket between `begin` and `end` is connected.
     * 
     * @param {Number} begin
     * @param {Number} end
     * @return {Boolean}
     */
    isLinked(begin, end) {
        if (isNaN(parseInt(begin, 10)) || isNaN(parseInt(end, 10))) throw new RangeError();
        if (begin == end) return 0;
        if (begin > end) {
            let tmp = begin;
            begin = end;
            end = tmp;
        }
        let off = begin;
        while (off < end) {
            const isLinked = (this.sockets >> (SOCKET_LINK_OFFSET + off)) & SOCKET_LINK_SIZE;
            if (!isLinked) return 0;
            off++;
        }
        return 1;
    }

    /**
     * Parse the given socket string into an instance of `Sockets`.
     * 
     * @param {String} s 
     * @return {Sockets}
     */
    static parseStr(s) {
        if (s.length && s.length % 2 === 0) {
            throw new RangeError();
        }
        const sockets = new Sockets();
        let i = 0;
        let n = s.length === 0 ? 0 : Math.floor(s.length / 2) + 1;
        if (n > MAX_SOCKETS) {
            throw new RangeError();
        }
        for (i = 0; i < n; ++i) { // set socket colors
            sockets.sockets |= (cvColStr(s[i * 2]) << (SOCKET_SLOT_SIZE * i));
        }
        for (i = 0; i < n-1; ++i) { // set socket links
            sockets.sockets |= ((s[i * 2 + 1] == '-') << (SOCKET_LINK_OFFSET + i));
        }
        return sockets;
    }

    inspect() {
        let output = ''
        const numSockets = this.getNumSockets();
        for (let i = 0; i < MAX_SOCKETS; ++i) {
            try {
                output += colToStr(this.getSocketColor(i));
            } catch(ex) {
                throw new Error(`Could not inspect because there was an invalid socket color at index ${i}: ${this.getSocketColor(i)}`);
            }
            if (i < numSockets - 1) {
                output += this.isLinked(i, i+1) ? '-' : ' ';
            }
        }
        console.log(output);
    }
}

module.exports = {
    Sockets,
    SOCKET_NONE,
    SOCKET_BLUE,
    SOCKET_GREEN,
    SOCKET_RED,
    SOCKET_WHITE
};