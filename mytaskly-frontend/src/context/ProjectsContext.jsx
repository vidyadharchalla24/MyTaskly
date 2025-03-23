import { createContext, useState } from "react";

export const ProjectsContext = createContext();

export const ProjectsProvider = ({children})=>{

    const [projectId,setProjectId] = useState('');
    const [sprintsUpdates,setSprintsUpdates] = useState(false);

    return (
        <ProjectsContext.Provider value={{projectId,setProjectId,sprintsUpdates,setSprintsUpdates}}>
            {children}
        </ProjectsContext.Provider>
    );

};