"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
function useState(initialValue) {
    var value = initialValue;
    function get() {
        return value;
    }
    function set(newVal) {
        value = newVal;
    }
    return { get: get, set: set };
}
exports.useState = useState;
