import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const initialDecoded = storedToken ? jwtDecode(storedToken) : null;
  const [organizationName, setOrganizationName] = useState("");

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

  
  useEffect(() => {
    if (!decodedToken) return;

    // Fetch organization details only if decodedToken exists
    if (decodedToken.organization_id) {
      api
        .get(`/api/v1/organizations/${decodedToken.organization_id}`)
        .then((response) => {
          setOrganizationName(response.data.name);
        })
        .catch((err) => console.error("Error fetching organization:", err));
    }
  }, [decodedToken]); // Runs only when decodedToken changes


  const setToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return;
    localStorage.setItem("token", token);
    setDecodedToken(decoded);
  };

  const logout = () => {
    setDecodedToken(null);
    setOrganizationName("");
    localStorage.removeItem("token");
  };

  return (
    <TokenContext.Provider value={{ decodedToken, organizationName,setToken, logout }}>
      {children}
    </TokenContext.Provider>
  );
};
