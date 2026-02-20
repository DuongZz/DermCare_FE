(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/components/Header.tsx'\n\nUnexpected token. Did you mean `{'>'}` or `&gt;`?");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/src/utils/storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTokens",
    ()=>clearTokens,
    "getToken",
    ()=>getToken,
    "removeToken",
    ()=>removeToken,
    "setToken",
    ()=>setToken
]);
const setToken = (key, value, remember = true)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Clear from both first to avoid duplicates
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    if (remember) {
        localStorage.setItem(key, value);
    } else {
        sessionStorage.setItem(key, value);
    }
};
const getToken = (key)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem(key) || sessionStorage.getItem(key);
};
const removeToken = (key)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
};
const clearTokens = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const tokens = [
        'accessToken',
        'refreshToken',
        'clientId',
        'preAccessToken',
        'preAccessType',
        'user'
    ];
    tokens.forEach((token)=>{
        removeToken(token);
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/tokenStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccessToken",
    ()=>getAccessToken,
    "setAccessToken",
    ()=>setAccessToken
]);
let accessToken = null;
const setAccessToken = (token)=>{
    accessToken = token;
};
const getAccessToken = ()=>{
    return accessToken;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/apiClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tokenStore.ts [app-client] (ecmascript)");
;
;
;
// Get API URL from environment variables
const API_URL = ("TURBOPACK compile-time value", "http://localhost:4000/v1") || 'http://localhost:8888/api/v1';
// Create axios instance
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-platform': 'WEB'
    },
    withCredentials: true
});
// Request interceptor - Add auth token if available
apiClient.interceptors.request.use((config)=>{
    // Get token from memory store
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API Request] Attached Token: ${token.substring(0, 10)}...`);
    } else {
        console.log(`[API Request] No Token attached`);
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor - Handle errors globally
apiClient.interceptors.response.use((response)=>{
    return response;
}, async (error)=>{
    const originalRequest = error.config;
    // If 401 and we haven't retried yet, try to refresh token
    // Skip refresh for logout requests AND wash requests to prevent loops
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/logout') && !originalRequest.url?.includes('/auth/wash')) {
        originalRequest._retry = true;
        try {
            // Call wash endpoint (uses cookie automatically)
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/auth/wash`, {}, {
                withCredentials: true // Important to send cookies
            });
            if (data.data && data.data.accessToken) {
                const newAccessToken = data.data.accessToken;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(newAccessToken);
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            }
        } catch (refreshError) {
            // Refresh failed, logout user
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(null);
            // Also clear storage if anything remains
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('accessToken'); // Just in case
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('refreshToken');
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/authService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "forgotPassword",
    ()=>forgotPassword,
    "getCurrentUser",
    ()=>getCurrentUser,
    "login",
    ()=>login,
    "loginWithGoogle",
    ()=>loginWithGoogle,
    "logout",
    ()=>logout,
    "register",
    ()=>register,
    "resendVerifyEmail",
    ()=>resendVerifyEmail,
    "resetPassword",
    ()=>resetPassword,
    "verify2FA",
    ()=>verify2FA,
    "verifyEmail",
    ()=>verifyEmail,
    "washToken",
    ()=>washToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tokenStore.ts [app-client] (ecmascript)");
;
;
;
const login = async (credentials)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
    });
    const remember = credentials.rememberMe ?? false;
    // Handle successful login (not pre-access)
    if (data.data && !data.data.isPreAccess) {
        // Set Access Token in Memory
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(data.data.accessToken);
        // Clear legacy tokens from storage if they exist
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('accessToken');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('refreshToken');
        // We don't store refreshToken in localStorage/sessionStorage anymore because it is HttpOnly Cookie
        // But we might want to store "isLoggedIn" flag or clientId
        if (data.data.clientId) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('clientId', data.data.clientId, remember);
        }
    } else if (data.data && data.data.isPreAccess) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('preAccessToken', data.data.accessToken, false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('preAccessType', data.data.preAccessType || '', false);
    }
    return data;
};
const register = async (userData)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/register', userData);
    if (data.data && data.data.accessToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('preAccessToken', data.data.accessToken, false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('preAccessType', data.data.preAccessType || '', false);
    }
    return data;
};
const verifyEmail = async (otp)=>{
    const preAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])('preAccessToken');
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/verify-email', {
        otp
    }, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('preAccessToken');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('preAccessType');
    return data;
};
const resendVerifyEmail = async ()=>{
    const preAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])('preAccessToken');
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/resend-ve', {}, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`
        }
    });
    return data;
};
const washToken = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/wash');
    return data;
};
const verify2FA = async (otp)=>{
    const preAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])('preAccessToken');
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/verify-2fa', {
        otp
    }, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`
        }
    });
    if (data.data && !data.data.isPreAcesss) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(data.data.accessToken);
        if (data.data.clientId) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('clientId', data.data.clientId, false);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('preAccessToken');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('preAccessType');
    }
    return data;
};
const logout = async ()=>{
    try {
        const fcmToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])('fcmToken');
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/logout', {
            fcmToken
        });
    } finally{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(null);
    }
};
const getCurrentUser = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/users/me');
    return data.data;
};
const loginWithGoogle = async (token)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/google', {
        token
    });
    // Save tokens to localStorage (default true or false? usually social login implies remember me)
    if (data.data && !data.data.isPreAcesss) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('accessToken', data.data.accessToken, true);
        if (data.data.refreshToken) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('refreshToken', data.data.refreshToken, true);
        }
        if (data.data.clientId) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('clientId', data.data.clientId, true);
        }
    }
    return data;
};
const forgotPassword = async (email)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/forgot-password', {
        email
    });
    if (data.data && data.data.accessToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('preAccessToken', data.data.accessToken, false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setToken"])('preAccessType', data.data.preAccessType || '', false);
    }
    return data;
};
const resetPassword = async (otp, newPassword)=>{
    const preAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])('preAccessToken');
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/reset-password', {
        otp,
        newPassword
    }, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('preAccessToken');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('preAccessType');
    return data;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/authService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tokenStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const fetchUser = async ()=>{
        try {
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            console.log("AuthContext: fetchUser success", userData);
            setUser(userData);
        } catch (error) {
            console.error("AuthContext: Failed to fetch user:", error);
        // logout(); 
        }
    };
    const initializeAuth = async ()=>{
        // Clear legacy tokens from local storage to enforce cookie flow
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('accessToken');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeToken"])('refreshToken');
        try {
            // Try to refresh token using cookie
            console.log("AuthContext: initializing auth...");
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["washToken"])();
            if (response.success && response.data.accessToken) {
                console.log("AuthContext: washToken success");
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(response.data.accessToken);
                setIsLoggedIn(true);
                await fetchUser();
            }
        } catch (error) {
            console.error("AuthContext: Valid session not found (wash failed or fetchUser failed)", error);
            // Valid session not found
            setIsLoggedIn(false);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            initializeAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = ()=>{
        setIsLoggedIn(true);
        fetchUser();
    };
    const logout = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])();
        } catch (error) {
            console.error("Logout failed", error);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tokenStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(null);
        setIsLoggedIn(false);
        setUser(null);
        router.push("/login");
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/contexts/AuthContext.tsx",
            lineNumber: 84,
            columnNumber: 16
        }, this); // Or a spinner
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            isLoggedIn,
            user,
            login,
            logout,
            fetchUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 88,
        columnNumber: 9
    }, this);
}
_s(AuthProvider, "g24Awm2Bw5XTwLcsFHCpZbwEA5c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ClientLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ClientLayout({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isChat = pathname === "/chat";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: [
            !isChat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/ClientLayout.tsx",
                lineNumber: 13,
                columnNumber: 25
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ClientLayout.tsx",
                lineNumber: 14,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ClientLayout.tsx",
        lineNumber: 12,
        columnNumber: 9
    }, this);
}
_s(ClientLayout, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ClientLayout;
var _c;
__turbopack_context__.k.register(_c, "ClientLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_314a6679._.js.map