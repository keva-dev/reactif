"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = void 0;
var makeObjReactive_1 = require("./makeObjReactive");
function createState(newState) {
    return makeObjReactive_1.makeObjectReactive(newState);
}
exports.createState = createState;
