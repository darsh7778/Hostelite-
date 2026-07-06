import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext); 


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    // load auth data on referesh

    useEffect(() => {
        const savedAccessToken = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (savedAccessToken && savedUser) {
            setAccessToken(savedAccessToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (accessToken, user) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setAccessToken(accessToken);
        setUser(user);
    };
    const logout = async () => {
        try {
            await API.post("/auth/logout");
        } catch (error) {
            // Continue with local logout even if backend call fails
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
    };

    return (
         <AuthContext.Provider 
            value={{ 
                user,
                accessToken,
                login,
                logout,
                isAuthenticated: !!accessToken,
                loading
            }}
            >
            {children}
            </AuthContext.Provider>
    );
};
