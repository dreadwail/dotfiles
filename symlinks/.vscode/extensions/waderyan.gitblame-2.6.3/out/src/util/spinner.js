"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_1 = require("./property");
class Spinner {
    constructor() {
        this.state = 0;
    }
    updatable() {
        return this.getStates().length > 1;
    }
    toString() {
        const states = this.getStates();
        this.nextState(states);
        return states[this.state];
    }
    nextState(possibleStates) {
        let newStateValue = this.state + 1;
        if (newStateValue >= possibleStates.length) {
            newStateValue = 0;
        }
        this.state = newStateValue;
    }
    getStates() {
        const states = property_1.Property.get("progressSpinner");
        if (states) {
            return states;
        }
        else {
            return ["$(sync~spin)"];
        }
    }
}
exports.Spinner = Spinner;
//# sourceMappingURL=spinner.js.map