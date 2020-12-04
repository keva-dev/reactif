declare class Dependency {
    private deps;
    constructor();
    depend(): void;
    notify(): void;
}
export default Dependency;
