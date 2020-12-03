interface OddxReactive {
    $: any;
    useState: (newState: Record<string, any>) => Record<string, any>;
    mountComponent: (selector: string, fn: () => string) => void;
    on: (selector: string) => object;
    useEffect: (func: () => void) => void;
}
export declare const OddxReactive: OddxReactive;
export {};
