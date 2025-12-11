import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from "./pages/Home/auth/AuthProvider.jsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
    <AuthProvider>  
          <App />

      </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
  </StrictMode>
);
