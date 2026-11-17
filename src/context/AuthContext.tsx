
/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import { getMyDetails } from "../service/auth";

// User information
export interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    roles?: string[];
    avatar?: string;
    approve?: boolean;
}

// Authentication context structure
export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

// Create authentication context
export const AuthContext =
    createContext<AuthContextType | null>(null);

// Authentication provider
const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const checkAuthentication = async () => {

            const token = localStorage.getItem("ACCESS_TOKEN");

            // No token means the user is not logged in
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {

                // Get current user details from backend
                const response = await getMyDetails();

                // Extract user information
                const userData = response.data?.data ?? response.data;

                if (userData && userData.email) {
                    setUser(userData);
                } else {
                    setUser(null);
                }

            } catch (error) {

                console.error(
                    "Authentication check failed:",
                    error
                );

                setUser(null);

                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("REFRESH_TOKEN");

            } finally {

                setLoading(false);

            }
        };

        checkAuthentication();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
