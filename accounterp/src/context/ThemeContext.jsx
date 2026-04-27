import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Context Create Kiya
const ThemeContext = createContext();

// 2. Provider Component jo poori App ko wrap karega
export const ThemeProvider = ({ children }) => {
  // Check karo ki kya user ne pehle se koi theme select ki hai (LocalStorage se)
  // Agar nahi ki, toh default 'light' rakho
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // 3. useEffect: Jab bhi isDarkMode change ho, UI update karo
  useEffect(() => {
    const root = window.document.documentElement; // Yeh <html> tag ko target karta hai

    if (isDarkMode) {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // 4. Toggle Function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Custom Hook: Isse use karna bohot aasaan ho jata hai
// Baaki files mein sirf 'const { isDarkMode, toggleTheme } = useTheme();' likhna hoga
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};