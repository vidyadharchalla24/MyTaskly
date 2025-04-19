import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isOrganizationUpdated,setIsOrganizationUpdated] = useState(false);
  const [isProjectUpdated,setIsProjectUpdated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      try {
        decodedUser(accessToken);
      } catch (err) {
        console.error("Invalid Token", err);
        logout();
      }
    }
  }, []);

  const decodedUser = (accessToken) => {
    const decodedUserData = jwtDecode(accessToken);
    setIsAuthenticated(true);
    setUserDetails(decodedUserData);
  };

  const login = (data) =>{
    try{
      console.log(data);
      const {token,status} = data;
        decodedUser(token);
        localStorage.setItem("token", token);
        localStorage.setItem("status",status);
    }catch(err){
        console.error("Invalid token", err);
    }
  }

  const logout = () =>{
    // console.log("logout encountered");
    setUserDetails(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    
  }

  return (
    <UserContext.Provider value={{isAuthenticated,setIsAuthenticated,userDetails,setUserDetails,login,logout,isOrganizationUpdated,setIsOrganizationUpdated,isProjectUpdated,setIsProjectUpdated}} >
        {children}
    </UserContext.Provider>
  )

};
