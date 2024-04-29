import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./pages/auth";
import Layout from "./pages/layout";
import Login from "./pages/login";

const App = () => {
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("authToken"));

  const handleLogin = (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      setIsLogin(true);
      return <Navigate to="/home" replace />;
    } else {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLogin(false);
    return <Navigate to="/login" replace />;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout isLogin={isLogin} />} />
          <Route path="/home" element={<Layout isLogin={isLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/logout" element={handleLogout} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
