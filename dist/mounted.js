"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = void 0;
function mounted(fn) {
    if (typeof fn !== "function")
        return;
    setTimeout(function () {
        var cleanUp = fn();
        if (typeof cleanUp === "function") {
            var cleanClosure_1 = function (_) {
                cleanUp();
                window.removeEventListener('hashchange', cleanClosure_1, false);
            };
            window.addEventListener('hashchange', cleanClosure_1, false);
        }
    }, 0);
}
exports.mounted = mounted;
