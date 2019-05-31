const {
    Winhook,
    Input
} = require('C:/p/winhook/build/Release/winhook.node');
const KBD_KEY_C = 0x43;
const KBD_KEY_CTRL = 0x11;

class Client {

    /** @var {String} windowTitle */
    /** @var {Number} windowHandle window handle referred to by `windowTitle` */

    constructor() {
        this.windowTitle = "Path of Exile"
        this.windowHandle = null
    }

    /**
     * Check whether the first window found with `windowTitle` is the current foreground window
     */
    isWindowActive() {
        if (this.windowHandle === null) {
            this.windowHandle = Winhook.FindWindow(this.windowTitle);
            if (!this.windowHandle) {
                return false;
            }
        }
        return Winhook.GetForegroundWindow() === this.windowHandle;
    }

    /**
     * Send the ctrl+c keyboard combination to the current foreground window.
     */
    sendCtrlC() {
        try {
            var sent = wh.SendInput.apply(wh, makeInputs([
                [KBD_KEY_CTRL],
                [KBD_KEY_C],
                [KBD_KEY_C, true],
                [KBD_KEY_CTRL, true]
            ]));
        } catch(ex) {
            return false;
        }
        if (sent === -1) {
            return false;
        }
        if (sent != inputs.length) {
            return false;
        }
    }

    /**
     * Shorthand method to convert a list of input scancodes to
     * instances of `winhook.Input`'s
     *
     * @param {Array} inputs
     */
    makeInputs(inputs) {
        return inputs.map(makeInput);
    }

    /**
     * Return a new instance of `winhook.Input` for the given scancode
     *
     * @param {Number} virtualKeyCode integer (0-255)
     * @param {Boolean} isKeyUp true for key released, false for pressed
     */
    makeInput(virtualKeyCode, isKeyUp) {
        var input = new Input();
        input.type = winhook.Winhook.INPUT_KEYBOARD;
        var payload = { wVk: virtualKeyCode };
        if (isKeyUp) payload.dwFlags = winhook.Input.KEYEVENTF_KEYUP;
        input.ki = payload;
        return input;
    }

}

module.exports = Client;
