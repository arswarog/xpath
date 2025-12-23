export const storage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
} = (() => {
    if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.getItem === 'function'
    ) {
        return window.localStorage;
    }

    // Заглушка для Node: просто возвращает null и игнорирует setItem.
    return {
        getItem: () => null,
        setItem: () => {},
    };
})();
