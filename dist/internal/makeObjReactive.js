"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeObjectReactive = void 0;
var dependency_1 = __importDefault(require("./dependency"));
function makeObjectReactive(obj) {
    Object.keys(obj).forEach(function (k) {
        var value = obj[k];
        var dep = new dependency_1.default();
        Object.defineProperty(obj, k, {
            get: function () {
                dep.depend();
                return value;
            },
            set: function (val) {
                value = val;
                dep.notify();
            }
        });
    });
    return obj;
}
exports.makeObjectReactive = makeObjectReactive;
