import { ComponentFunc } from './types';
export declare function getParams(): Record<string, string>;
export declare function useRouter(): {
    route: (path: string, fn: ComponentFunc) => void;
    render: (selector: string) => void;
};
