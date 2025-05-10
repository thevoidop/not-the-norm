"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the auth context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userID: "",
        loading: true,
    });

    // Function to check authentication status
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("/api/auth/check-auth", {
                withCredentials: true,
                validateStatus: (status) => status === 200 || status === 401,
            });

            if (response.status === 200) {
                const data = response.data;
                setAuthState({
                    isLoggedIn: true,
                    userID: data.id || "user",
                    loading: false,
                });
            } else {
                // 401 - Not logged in
                setAuthState({
                    isLoggedIn: false,
                    userID: "",
                    loading: false,
                });
            }
        } catch (error) {
            console.error("Unexpected auth check failure:", error);
            setAuthState({
                isLoggedIn: false,
                userID: "",
                loading: false,
            });
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            const response = await axios.post(
                "/api/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                setAuthState({
                    isLoggedIn: false,
                    userID: "",
                    loading: false,
                });

                // Clear any auth-related data in localStorage if you're using it
                if (typeof window !== "undefined") {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user_id");
                }

                // Force reload page to clear all component states
                if (typeof window !== "undefined") {
                    window.location.href = "/";
                }
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Check authentication status on initial load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const authContextValue = {
        ...authState,
        checkAuthStatus,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
