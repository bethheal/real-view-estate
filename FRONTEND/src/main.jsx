import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from "./pages/Home/auth/AuthProvider.jsx";
import { BrowserRouter } from "react-router-dom"; // Use 'react-router-dom' for BrowserRouter
import { GlobalSettingsProvider } from "./globalComponents/useGlobalSettings.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
       
        <GlobalSettingsProvider> 
          <AuthProvider> 
            <App />
          </AuthProvider>
        </GlobalSettingsProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);