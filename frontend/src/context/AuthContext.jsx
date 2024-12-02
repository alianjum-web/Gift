import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create Context
const AppContext = createContext();

// AuthProvider component that provides context values
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};

// PropTypes validation for children prop
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

