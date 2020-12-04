export declare function useState<T>(initialValue: T): {
    get: () => T;
    set: (newVal: T) => void;
};
