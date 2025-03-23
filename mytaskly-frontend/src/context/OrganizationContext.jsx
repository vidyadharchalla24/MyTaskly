import { createContext, useState } from "react";

export const OrganizationContext = createContext();

export const OrganizationProvider =({children}) =>{

    const [organizationName,setOrganizationName] = useState(null);

    return (
        <OrganizationContext.Provider value={{organizationName,setOrganizationName}}>
            {children}
        </OrganizationContext.Provider>
    );
};