import { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Input, Alert } from "antd";
import { createTodo } from "../services/todos";
import Button from "../components/Button";
import Home from "./home";
import Login from "./login";

const Layout = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  let isLogin = !!localStorage.getItem("authToken");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
      setAlertMessage("Title & Description is required.");
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

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/home", element: <Home /> },
    { path: "/login", element: <Login /> },
  ]);

  return (
    <div className="layout">
      <header className="flex justify-between mb-8">
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
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
      >
        <div className="my-4">
          <span className="mb-2 text-md font-bold">
            Title <span className="text-red-500">*</span>
          </span>
          <Input
            placeholder="Enter Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="my-4">
          <span className="mb-2 text-md font-bold">
            Description <span className="text-red-500">*</span>
          </span>
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
      {routes}
    </div>
  );
};

export default Layout;
