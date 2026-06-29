import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { loginUser, registerUser } from '../api/auth';
import type { AuthUser } from '../types';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('bl_token'),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('bl_user');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    const accessToken = data.accessToken ?? data.token ?? data.Token ?? '';
    const userData: AuthUser = { email, fullName: data.fullName ?? email };
    localStorage.setItem('bl_token', accessToken);
    localStorage.setItem('bl_user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string, phone: string) => {
      await registerUser({ email, password, fullName, phone });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('bl_token');
    localStorage.removeItem('bl_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}