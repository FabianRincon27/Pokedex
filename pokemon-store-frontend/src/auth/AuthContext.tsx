import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types/auth';
import { jwtDecode } from 'jwt-decode';


interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
            const decoded: any = jwtDecode(token);
            setUser({
                userId: decoded.sub,
                email: decoded.email,
            });
        }
    }, [token]);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
      value= {{
        user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
      }
}
    >
    { children }
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
