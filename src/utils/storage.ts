export const setToken = (key: string, value: string, remember: boolean = true) => {
    if (typeof window === 'undefined') return;

    // Clear from both first to avoid duplicates
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);

    if (remember) {
        localStorage.setItem(key, value);
    } else {
        sessionStorage.setItem(key, value);
    }
};

export const getToken = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key) || sessionStorage.getItem(key);
};

export const removeToken = (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
};

export const clearTokens = () => {
    if (typeof window === 'undefined') return;
    const tokens = ['accessToken', 'refreshToken', 'clientId', 'preAccessToken', 'preAccessType', 'user'];
    tokens.forEach(token => {
        removeToken(token);
    });
};
