export declare function getParams(): Record<string, string>;
export declare function useRouter(): {
    route: (path: string, fn: () => string) => void;
    render: (selector: string) => void;
};
