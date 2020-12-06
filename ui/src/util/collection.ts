function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

function _shuffle<T>(items: T[]): T[] {
    return items.sort((_, __) => Math.random() - 0.5);
}

export const copyAndSort: <T>(items: T[], columnKey: string, isSortedDescending?: boolean) => T[] = _copyAndSort;
export const shuffle: <T>(items: T[]) => T[] = _shuffle;