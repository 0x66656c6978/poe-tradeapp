const {
    Winhook,
    Input
} = require('C:/p/winhook/build/Release/winhook.node');
const KBD_KEY_C = 0x43;
const KBD_KEY_CTRL = 0x11;

class Client {

    windowTitle = "Path of Exile"
    poeWindowHandle = null

    isWindowActive() {
        if (this.poeWindowHandle === null) {
            this.poeWindowHandle = Winhook.FindWindow(this.windowTitle);
            if (!this.poeWindowHandle) {
                return false;
            }
        }
        return Winhook.GetForegroundWindow() === this.poeWindowHandle;
    }

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

    makeInputs(inputs) {
        return inputs.map(makeInput);
    }

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
