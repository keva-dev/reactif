interface ReOdd {
    useState: (newState: object) => object;
    render: (selector: string, fn: () => string) => void;
    useEffect: (func: () => void) => void;
    on: (selector: string) => object;
    Router: any;
}
declare const ReOdd: ReOdd;
export default ReOdd;
