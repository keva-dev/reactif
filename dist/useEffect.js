"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = void 0;
var used = [];
var useEffect = function (fn) {
    setTimeout(function () {
        if (!used.some(function (e) { return e === fn; })) {
            used.push(fn);
            fn();
        }
    }, 0);
};
exports.useEffect = useEffect;
