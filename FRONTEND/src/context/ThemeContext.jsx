import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const ThemeContext = createContext();

// Function to get the initial theme preference
const getInitialTheme = () => {
  // Try to load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check for system preference (prefers-color-scheme)
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // Default to light
  return 'light';
};

// 2. Create the Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Effect to handle side-effects (localStorage and DOM updates)
  useEffect(() => {
    const root = window.document.documentElement;
    
    // 1. Update localStorage
    localStorage.setItem('theme', theme);
    
    // 2. Update the DOM element
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create the Custom Hook (optional, but recommended)
// We'll define this in the next step, but here's how to export the context for it.
export { ThemeContext };