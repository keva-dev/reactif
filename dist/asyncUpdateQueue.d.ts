import { HandlerFunc } from './types';
export declare function useAsyncUpdateQueue(): {
    add: (fn: HandlerFunc) => void;
    nextTick: () => void;
};
export declare const asyncUpdateQueue: {
    add: (fn: HandlerFunc) => void;
    nextTick: () => void;
};
