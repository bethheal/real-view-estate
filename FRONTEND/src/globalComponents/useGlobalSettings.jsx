// useGlobalSettings.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from "../config/axios"; // Import your API instance
import { toast } from "react-toastify"; // Import toast for feedback

// 1. Create Context
const GlobalSettingsContext = createContext();

// 2. Create Provider
export const GlobalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Initial/Default State (Matching your AppSettings defaults)
    emailNotifications: true,
    inAppNotifications: true,
    dnd: false,
    currency: "USD",
    timezone: "GMT-5",
    language: "en",
    units: "Imperial"
  });
  const [loading, setLoading] = useState(true);

  // 3. Fetch Settings on Load (Once for the entire app)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/user/settings");
        setSettings(res.data);
      } catch (err) {
        toast.warn("Could not load custom settings. Using defaults.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 4. Centralized Handler to Update State (in memory)
  const updateLocalSettings = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Centralized Handler to Submit & Save Settings (API Call)
  const saveSettings = async (currentSettings) => {
    try {
      await api.put("/user/settings", currentSettings);
      toast.success("Settings updated successfully!");
      return true; // Indicate success
    } catch (err) {
      toast.error("Failed to save settings. Please try again.");
      return false; // Indicate failure
    }
  };

  const contextValue = {
    settings,
    loading,
    updateLocalSettings, // For managing input changes
    saveSettings,        // For submitting to the API
  };

  return (
    <GlobalSettingsContext.Provider value={contextValue}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

// 6. Custom Hook for easy consumption
export const useGlobalSettings = () => useContext(GlobalSettingsContext);