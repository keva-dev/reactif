"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMounted = void 0;
function onMounted(fn) {
    setTimeout(function () {
        fn();
    }, 0);
}
exports.onMounted = onMounted;
