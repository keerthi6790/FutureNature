import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/api/apiClient";
import Loader from "./Loader";

interface LoadingContextType {
    setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [activeRequests, setActiveRequests] = useState(0);

    useEffect(() => {
        const requestInterceptor = apiClient.interceptors.request.use(
            (config) => {
                setActiveRequests((prev) => prev + 1);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = apiClient.interceptors.response.use(
            (response) => {
                setActiveRequests((prev) => Math.max(0, prev - 1));
                return response;
            },
            (error) => {
                setActiveRequests((prev) => Math.max(0, prev - 1));
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const setLoading = (loading: boolean) => {
        setActiveRequests((prev) => (loading ? prev + 1 : Math.max(0, prev - 1)));
    };

    return (
        <LoadingContext.Provider value={{ setLoading }}>
            {activeRequests > 0 && <Loader />}
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
