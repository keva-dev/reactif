"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on = void 0;
var used = [];
function on(selector) {
    return {
        click: function (handler) {
            if (!used.some(function (e) { return e === handler; })) {
                document.querySelector(selector).addEventListener('click', handler);
            }
        },
        event: function (type, handler) {
            if (!used.some(function (e) { return e === handler; })) {
                document.querySelector(selector).addEventListener(type, handler);
            }
        }
    };
}
exports.on = on;
