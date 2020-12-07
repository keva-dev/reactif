"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = void 0;
function singleton(item) {
    if (typeof item !== 'function') {
        throw new Error('Invalid singleton item');
    }
    var dep = null; // Init object instance
    function useItem() {
        if (dep != null) {
            // @ts-ignore
            dep = item();
            console.log('New item created!');
        }
        return dep;
    }
    return useItem;
}
exports.singleton = singleton;
