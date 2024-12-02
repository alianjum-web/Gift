// useAppContext.js
import { useContext } from "react";
import { AppContext } from "./AuthContext"; // Import the correct context

// Custom hook to access context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AuthProvider");
  }
  return context;
};
