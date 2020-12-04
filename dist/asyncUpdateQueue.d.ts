declare type Handler = () => void;
export declare function useAsyncUpdateQueue(): {
    add: (fn: Handler) => void;
    nextTick: () => void;
};
export {};
