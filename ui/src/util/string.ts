export function sanitize(str: string): string {
    return str.replaceAll(/_|-|(\+)/g, " ")
}

export function firstUpperCase(str: string): string {
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
}