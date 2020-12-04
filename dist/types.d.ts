export declare type ComponentFunc = () => RenderFunc;
export declare type RenderFunc = () => string;
export declare type HandlerFunc = () => void;
export declare type HandlerFuncWithCleanUp = () => HandlerFunc;
