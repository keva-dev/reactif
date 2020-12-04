import { Router } from './router';
interface OddxReactive {
    $: any;
    useState: (newState: Record<string, any>) => Record<string, any>;
    render: (selector: string, fn: () => string) => void;
    on: (selector: string) => object;
    useEffect: (func: () => void) => void;
    router: Router;
}
export declare const OddxReactive: OddxReactive;
export default OddxReactive;
