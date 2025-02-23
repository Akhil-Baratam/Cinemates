import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (!res.ok) return null;
        return await res.json();
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setAuthUser(data);
  }, [data]);

  return (
    <AuthContext.Provider value={{ authUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
