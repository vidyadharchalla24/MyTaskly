// import React, { createContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode"; 


// export const TokenContext = createContext();
// export const TokenProvider = ({ children }) => {
//   const [decodedToken, setDecodedToken] = useState(null);

//   useEffect(() => {
  
//       const token = localStorage.getItem("token");

//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           setDecodedToken(decoded);
//           console.log(decoded);
//           localStorage.setItem("decodedToken", JSON.stringify(decoded));
//         } catch (error) {
//           console.error("Invalid token:", error);
//           localStorage.removeItem("token");
//           localStorage.removeItem("decodedToken");
//           setDecodedToken(null);
//         }
//       } else {
//         setDecodedToken(null);
//         localStorage.removeItem("decodedToken");
//       }
//   }, []);

//     useEffect(() => {
//       console.log(decodedToken);
//     }, [decodedToken]);
 

//   return (
//     <TokenContext.Provider value={{ decodedToken }}>
//       {children}
//     </TokenContext.Provider>
//   );
// };
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [decodedToken, setDecodedToken] = useState(null);

  // Function to update token
  const updateToken = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
        // localStorage.setItem("token", token);
        console.log(decoded);
        localStorage.setItem("decodedToken", JSON.stringify(decoded));
      } catch (error) {
        console.error("Invalid token:", error);
        setDecodedToken(null);
        localStorage.removeItem("token");
      }
    } else {
      setDecodedToken(null);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      updateToken(storedToken);
    }
  }, []);

  return (
    <TokenContext.Provider value={{ decodedToken, updateToken }}>
      {children}
    </TokenContext.Provider>
  );
};


