import { Router } from './router';
interface ReOdd {
    useState: (newState: Record<string, any>) => Record<string, any>;
    render: (selector: string, fn: () => string) => void;
    useEffect: (func: () => void) => void;
    on: (selector: string) => object;
    router: Router;
}
declare const ReOdd: ReOdd;
export default ReOdd;
