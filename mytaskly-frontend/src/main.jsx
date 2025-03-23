import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserContext.jsx";
import { OrganizationProvider } from "./context/OrganizationContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <OrganizationProvider>
          <ProjectsProvider>
            <ToastContainer position="top-right" autoClose={1000} />
            <App />
          </ProjectsProvider>
        </OrganizationProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
