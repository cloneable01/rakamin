import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Input, Alert } from "antd";
import { createTodo } from "../services/todos";
import Button from "../components/Button";
import login from "../services/login";

const Layout = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  // const [alertClass, setAlertClass] = useState("");
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("authToken"));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    login(email, password).then((token) => {
      if (token) {
        localStorage.setItem("authToken", token);
        setIsLogin(true);
        setAlertMessage("Login successful!");
        navigate("/home");
      } else {
        setAlertMessage("Wrong email or password!");
      }
    });
  };

  const handleAddGroup = () => {
    setIsModalVisible(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("authToken");

    if (title.trim() !== "" && description.trim() !== "" && token) {
      createTodo(title, description, token)
        .then((response) => {
          console.log("Todo created:", response);
          setAlertMessage("Success create new todo");
          setAlertType("success");
          setIsModalVisible(false);
        })
        .catch((error) => {
          console.error("Failed to create todo:", error);
          setAlertMessage(error.toString());
          setAlertType("danger");
        });
    } else {
      setAlertMessage("Title, description, or token is missing.");
      setAlertType("warning");
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timeoutId = setTimeout(() => {
        setAlertMessage("");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertMessage]);

  // const closeAlert = () => {
  //   setAlertMessage("");
  // };

  return (
    <div className="layout">
      <header className="flex justify-between">
        <div className="flex">
          <div className="mr-4 my-auto">
            <h1 className="text-xl">Product Roadmap</h1>
          </div>
          {isLogin && (
            <Button type="primary" onClick={handleAddGroup}>
              <PlusOutlined className="mr-2" /> Add New Group
            </Button>
          )}
        </div>
        {!isLogin && (
          <div className="flex">
            <input
              placeholder="email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              className="border py-1 px-2 rounded mr-2"
            />
            <input
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="border py-1 px-2 rounded mr-2"
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
        )}
      </header>
      {alertMessage && !isModalVisible && (
        <div className=" relative" role="alert">
          <Alert
            message={alertMessage}
            type={alertType}
            className="absolute top-0"
          />
        </div>
      )}
      <Modal
        title="Add New Group"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
      >
        <div className="my-4">
          <span className="mb-2 text-md font-bold">Title</span>
          <Input
            placeholder="Enter Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="my-4">
          <span className="mb-2 text-md font-bold">Description</span>
          <Input
            placeholder="Enter Description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        {alertMessage && isModalVisible && (
          <div className=" relative" role="alert">
            <Alert
              message={alertMessage}
              type={alertType}
              className="absolute top-0"
            />
          </div>
        )}
      </Modal>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
