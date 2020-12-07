"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUnmounted = void 0;
function onUnmounted(fn) {
    var cleanClosure = function (_) {
        fn();
        window.removeEventListener('hashchange', cleanClosure, false);
    };
    window.addEventListener('hashchange', cleanClosure, false);
}
exports.onUnmounted = onUnmounted;
