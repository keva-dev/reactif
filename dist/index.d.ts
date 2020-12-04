import { ComponentFunc, HandlerFunc } from './types';
interface ReOdd {
    reactive: (state: object) => object;
    render: (selector: string, componentFunc: ComponentFunc) => void;
    mounted: (func: HandlerFunc) => void;
    on: (selector: string) => object;
    Router: any;
    nextTick: () => void;
    readonly: (state: object) => object;
}
declare const ReOdd: ReOdd;
export default ReOdd;
