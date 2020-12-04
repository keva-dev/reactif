"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeObjectReactive = void 0;
var dependency_1 = __importDefault(require("./dependency"));
function makeObjectReactive(obj) {
    var dep = new dependency_1.default();
    return new Proxy(obj, {
        get: function (target, p, receiver) {
            dep.depend();
            return Reflect.get(target, p, receiver);
        },
        set: function (target, p, value, receiver) {
            var set = Reflect.set(target, p, value, receiver);
            dep.notify();
            return set;
        }
    });
}
exports.makeObjectReactive = makeObjectReactive;
