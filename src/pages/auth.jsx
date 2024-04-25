import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
import login from "../services/login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogin = (email, password) => {
    return login(email, password).then((token) => {
      if (token) {
        localStorage.setItem("authToken", token);
        setIsLoggedIn(true);
        return true;
      } else {
        return false;
      }
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
