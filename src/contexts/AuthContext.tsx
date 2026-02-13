"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, getCurrentUser, washToken, logout as logoutService } from "@/services/authService";
import { clearTokens, removeToken } from "@/utils/storage";
import { setAccessToken } from "@/lib/tokenStore";

export interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: () => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const userData = await getCurrentUser();
            console.log("AuthContext: fetchUser success", userData);
            setUser(userData);
        } catch (error) {
            console.error("AuthContext: Failed to fetch user:", error);
            // logout(); 
        }
    };

    const initializeAuth = async () => {
        // Clear legacy tokens from local storage to enforce cookie flow
        removeToken('accessToken');
        removeToken('refreshToken');

        try {
            // Try to refresh token using cookie
            console.log("AuthContext: initializing auth...");
            const response = await washToken();
            if (response.success && response.data.accessToken) {
                console.log("AuthContext: washToken success");
                setAccessToken(response.data.accessToken);
                setIsLoggedIn(true);
                await fetchUser();
            }
        } catch (error) {
            console.error("AuthContext: Valid session not found (wash failed or fetchUser failed)", error);
            // Valid session not found
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = () => {
        setIsLoggedIn(true);
        fetchUser();
    };

    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Logout failed", error);
        }

        clearTokens();
        setAccessToken(null);
        setIsLoggedIn(false);
        setUser(null);
        router.push("/login");
    };

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
