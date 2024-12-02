// useAppContext.js
import { createContext , useContext } from 'react';
// import { AppContext } from './AuthContext.jsx'; // Import the context

// Custom hook to access context
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);