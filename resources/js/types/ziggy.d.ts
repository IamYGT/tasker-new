declare global {
    interface Window {
        route: (name: string, params?: Record<string, any>) => string;
    }
}

declare function route(name: string, params?: Record<string, any>): string;

export { route };
