// Login.jsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import login from "../services/login";
import { Input, Button } from "antd";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleLogin = () => {
    login(email, password).then((token) => {
      if (token) {
        localStorage.setItem("authToken", token);
        setIsLoggedIn(true);
        setAlertMessage("Login successful!");
      } else {
        setAlertMessage("Wrong email or password!");
        setAlertType("error");
      }
    });
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-container h-screen relative">
      <div className=" w-full absolute top-[25%]">
        <div className="mx-auto max-w-[500px] shadow-lg rounded py-4 px-6">
          <div className=" mb-4 w-full text-center">
            <h1 className=" text-xl font-bold text-gray-500">Login</h1>
          </div>
          <div className="block mb-4">
            <div className="font-bold mb-1">Email</div>
            <Input
              placeholder="Input email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="block mb-4">
            <div className="font-bold mb-1">Password</div>
            <Input.Password
              placeholder="Insert password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-4 w-full text-right">
            <Button type="primary" onClick={handleLogin}>
              Login
            </Button>
          </div>
          <div className=" text-amber-500">
            {alertMessage && <p className={alertType}>{alertMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
