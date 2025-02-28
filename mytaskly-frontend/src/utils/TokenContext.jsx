import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const initialDecoded = storedToken ? jwtDecode(storedToken) : null;

  const [decodedToken, setDecodedToken] = useState(initialDecoded);

  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    const decoded = decodeToken(storedToken);
    if (decoded) {
      setDecodedToken(decoded);
    } else {
      localStorage.removeItem("token");
    }
  }, []);

  const setToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return;
    localStorage.setItem("token", token);
    setDecodedToken(decoded);
  };

  const logout = () => {
    setDecodedToken(null);
    localStorage.removeItem("token");
  };

  return (
    <TokenContext.Provider value={{ decodedToken, setToken, logout }}>
      {children}
    </TokenContext.Provider>
  );
};
