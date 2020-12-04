"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on = void 0;
var used = [];
function on(selector) {
    return {
        click: function (handler) {
            if (!used.some(function (e) { return e === handler; })) {
                document.querySelector(selector).addEventListener('click', handler, false);
            }
        },
        event: function (type, handler) {
            if (!used.some(function (e) { return e === handler; })) {
                document.querySelector(selector).addEventListener(type, handler, false);
            }
        },
        removeEvent: function (type, handler) {
            if (!used.some(function (e) { return e === handler; })) {
                document.querySelector(selector).removeEventListener(type, handler, false);
            }
        }
    };
}
exports.on = on;
