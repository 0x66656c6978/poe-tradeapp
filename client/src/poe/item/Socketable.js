import Equippable from './Equippable';
import { Sockets } from './Sockets';

class Socketable extends Equippable {
    constructor() {
        super();
        this.sockets = new Sockets();
    }
}

module.exports = Socketable;