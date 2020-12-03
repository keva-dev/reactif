"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on = void 0;
var $ = document.getElementById.bind(document);
var used = [];
function on(selector) {
    return {
        click: function (handler) {
            if (!used.some(function (e) { return e === handler; })) {
                $(selector).addEventListener('click', handler);
            }
        }
    };
}
exports.on = on;
