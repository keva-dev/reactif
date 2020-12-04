"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createState_1 = require("./createState");
var createComponent_1 = require("./createComponent");
var mountHandler_1 = require("./mountHandler");
var mounted_1 = require("./mounted");
var router_1 = require("./router");
var asyncUpdateQueue_1 = require("./asyncUpdateQueue");
var readonly_1 = require("./readonly");
var ReOdd = {
    reactive: createState_1.createState,
    render: createComponent_1.createComponent,
    mounted: mounted_1.mounted,
    on: mountHandler_1.on,
    Router: {
        getParams: router_1.getParams,
        useRouter: router_1.useRouter
    },
    nextTick: asyncUpdateQueue_1.nextTick,
    readonly: readonly_1.readonly
};
exports.default = ReOdd;
