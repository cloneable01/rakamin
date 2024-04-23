import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/auth";
import Layout from "./pages/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
