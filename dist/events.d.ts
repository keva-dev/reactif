export declare function on(selector: string): {
    click: (handler: () => void) => void;
    event: (type: string, handler: () => void) => void;
    removeEvent: (type: string, handler: () => void) => void;
};
