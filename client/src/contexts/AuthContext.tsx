import { createContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserApi } from "@/api/auth";
import Loader from "@/components/Loader";

export interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserApi,
    refetchOnMount: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data.result);
      setIsAuthenticated(true);
      setIsAuthLoading(false);
    }
    if (error) {
      setIsAuthLoading(false);
    }
  }, [data, error]);

  if (isLoading || isAuthLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{ user, setIsAuthenticated, isAuthenticated, setUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
