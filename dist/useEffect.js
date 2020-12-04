"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = exports.clearEffect = void 0;
var closure_1 = require("./closure");
var used = closure_1.useState([]);
function clearEffect() {
    used.set([]);
}
exports.clearEffect = clearEffect;
function useEffect(fn) {
    setTimeout(function () {
        if (!used.get().some(function (e) { return e === fn; })) {
            used.get().push(fn);
            fn();
        }
    }, 0);
}
exports.useEffect = useEffect;
