declare type Handler = () => string;
export declare class UpdateQueue {
    private selector;
    private queue;
    private sleeping;
    constructor(selector: string);
    add(fns: Set<Handler>): void;
    run(): void;
}
export {};
