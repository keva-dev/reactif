"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = exports.clearEffect = void 0;
var used = [];
function clearEffect() {
    used = [];
}
exports.clearEffect = clearEffect;
function useEffect(fn) {
    setTimeout(function () {
        if (!used.some(function (e) { return e === fn; })) {
            used.push(fn);
            fn();
        }
    }, 0);
}
exports.useEffect = useEffect;
