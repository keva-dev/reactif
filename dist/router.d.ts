export declare class Router {
    private routes;
    private params;
    route(path: string, fn: () => string): void;
    param(key: string): string;
    private getPath;
    private match;
    render(selector: string): void;
}
