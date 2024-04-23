import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import Task from "../components/Task";
import Label from "../components/Label";
import setting from "../assets/setting.png";
import { fetchTodos, fetchItem } from "../services/todos";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const types = ["default", "warning", "danger", "success"];

  const fetchData = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchItemsForTodo = async (index) => {
      try {
        const items = await fetchItem(index + 1);
        setTodos((prevTodos) =>
          prevTodos.map((todo, todoIndex) =>
            todoIndex === index ? { ...todo, items } : todo
          )
        );
      } catch (error) {
        console.error(
          `Failed to fetch items for todo at index ${index}:`,
          error.message
        );
      }
    };

    // Fetch items for each task once when the component mounts
    todos.forEach((_, index) => {
      fetchItemsForTodo(index);
    });
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const handleModalVisibility = (visible) => {
    setIsModalVisible(visible);
  };

  return (
    <div className="flex overflow-x-scroll">
      {todos.map((todo, index) => (
        <Task
          key={todo.id}
          type={types[index % types.length]}
          className="w-[350px] min-w-[350px] mr-4 mb-12"
        >
          <Label type={types[index % types.length]}>{todo.title}</Label>
          <div className="my-4">{todo.description}</div>
          <ul>
            {todo.items &&
              todo.items.map((item) => (
                <li key={item.id}>
                  <div className="p-4 bg-[#FAFAFA] border-[#E0E0E0] rounded mb-2 border">
                    <div className="line-clamp-1 max-w-[300px] min-w-[300px]">
                      {item.name}
                    </div>
                    <div className="border-t border-dashed my-4" />
                    <div className="flex">
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${item.progress_percentage}%`,
                            backgroundColor:
                              item.progress_percentage === 100
                                ? "#007bff"
                                : "#01959F",
                          }}
                        ></div>
                      </div>
                      <div className="mx-4">
                        {item.done || item.progress_percentage === 100 ? (
                          <div className="my-auto text-green-500">
                            <CheckCircleFilled />
                          </div>
                        ) : (
                          <div>
                            {item.progress_percentage != null
                              ? `${item.progress_percentage}%`
                              : "-"}
                          </div>
                        )}
                      </div>
                      <button>
                        <img
                          src={setting}
                          className="text-black"
                          alt="setting"
                        />
                      </button>
                    </div>
                    <div>
                      <button
                        className="flex mt-2"
                        onClick={() => handleModalVisibility(true)}
                      >
                        <div className="my-auto">
                          <PlusCircleOutlined className="mr-2" />
                        </div>
                        <div className="my-auto font-light">New Task</div>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </Task>
      ))}
      <Modal
        title="New Task"
        visible={isModalVisible}
        onCancel={() => handleModalVisibility(false)}
        onOk={() => console.log("test")}
      >
        <div className="mb-2">
          <span className="mb-2">Name</span>
          <Input placeholder="Input Name" />
        </div>
        <div className="mb-2 block">
          <div>
            <span className="mb-2">Percentage</span>
          </div>
          <InputNumber
            placeholder="Input Percentage"
            min={0}
            max={100}
            formatter={(value) => `${value <= 100 ? value : 100}%`}
            parser={(value) => value.replace("%", "")}
            className="w-full"
          />
        </div>
      </Modal>
    </div>
  );
}
