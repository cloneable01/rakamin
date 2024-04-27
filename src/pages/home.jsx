import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircleFilled, PlusCircleOutlined } from "@ant-design/icons";
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Menu,
  Dropdown,
  Popconfirm,
} from "antd";
import Task from "../components/Task";
import Label from "../components/Label";
import setting from "../assets/setting.png";
import {
  fetchTodos,
  fetchItem,
  createItem,
  deleteItem,
} from "../services/todos";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [tasks, setTasks] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [todoIndex, setTodoIndex] = useState(0);
  // const [newTodoNameList, setNewTodoNameList] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPercentage, setNewTaskPercentage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const types = ["default", "warning", "danger", "success"];

  const fetchData = async () => {
    try {
      const todosData = await fetchTodos();
      setTodos(todosData);

      const tasksData = {};
      for (let i = 0; i < todosData.length; i++) {
        const todoId = Number([i]) + 1;
        const taskItem = await fetchItem(todoId);
        tasksData[todoId] = taskItem;
      }
      setTasks(tasksData);
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

  const handleDeleteConfirm = async (todoIndex, itemId) => {
    try {
      await deleteItem(todoIndex, itemId);
      fetchData();
      console.log("Task deleted!");
    } catch (error) {
      console.error("Failed to delete task:", error.message);
    }
  };

  const handleCreateTask = async (index) => {
    try {
      const url = `${index}/items`;
      await createItem(url, {
        name: newTaskName,
        progress_percentage: newTaskPercentage,
      });
      fetchData();

      handleModalVisibility(false);
    } catch (error) {
      console.error("Failed to create task:", error.message);
    }
  };

  useEffect(() => {
    console.log(todoIndex);
  }, [todoIndex]);

  const menu = (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => {
          setIsEdit(true);
          handleModalVisibility(true);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          title={`Are you sure you want to delete this task?`}
          onConfirm={() => {
            console.log(todoIndex, taskId);
            handleDeleteConfirm(todoIndex, taskId);
          }}
          okText="Yes"
          cancelText="No"
        >
          <span className="text-red-500">Delete</span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

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
          {tasks[index + 1] && tasks[index + 1].length > 0 ? (
            <ul>
              {tasks[index + 1].map((task) => (
                <li key={task.id}>
                  <div className="p-4 bg-[#FAFAFA] border-[#E0E0E0] rounded mb-2 border">
                    <div className="line-clamp-1 max-w-[300px] min-w-[300px]">
                      {task.name}
                    </div>
                    <div className="border-t border-dashed my-4" />
                    <div className="flex">
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${task.progress_percentage}%`,
                            backgroundColor:
                              task.progress_percentage === 100
                                ? "#007bff"
                                : "#01959F",
                          }}
                        ></div>
                      </div>
                      <div className="mx-4">
                        {task.done || task.progress_percentage === 100 ? (
                          <div className="my-auto text-green-500">
                            <CheckCircleFilled />
                          </div>
                        ) : (
                          <div>
                            {task.progress_percentage != null
                              ? `${task.progress_percentage}%`
                              : "-"}
                          </div>
                        )}
                      </div>
                      <Dropdown overlay={menu} arrow>
                        <bottom
                          onMouseEnter={() => {
                            setTaskId(task.id);
                            setTodoIndex(Number(index) + 1);
                          }}
                        >
                          <img
                            src={setting}
                            className="text-black"
                            alt="setting"
                          />
                        </bottom>
                      </Dropdown>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 bg-[#FAFAFA] border-[#E0E0E0] rounded mb-2 border text-[#757575]">
              No tasks
            </div>
          )}
          <div>
            <button
              className="flex mt-2"
              onClick={() => {
                handleModalVisibility(true);
                setTodoIndex(Number(index) + 1);
              }}
            >
              <div className="my-auto">
                <PlusCircleOutlined className="mr-2" />
              </div>
              <div className="my-auto font-light">New Task</div>
            </button>
          </div>
        </Task>
      ))}

      <Modal
        title="New Task"
        visible={isModalVisible}
        onCancel={() => {
          handleModalVisibility(false);
          setTodoIndex(0);
          setIsEdit(false);
          setNewTaskName("");
          setNewTaskPercentage(0);
        }}
        onOk={() => {
          handleCreateTask(todoIndex);
          setIsEdit(false);
          setNewTaskName("");
          setNewTaskPercentage(0);
        }}
      >
        <div className="mb-2">
          <span className="mb-2">Name</span>
          <Input
            placeholder="Input Name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
        </div>
        <div className="mb-2 block">
          <div>
            <span className="mb-2">Percentage</span>
          </div>
          <InputNumber
            placeholder="Input Percentage"
            min={0}
            max={100}
            value={newTaskPercentage}
            formatter={(value) => `${value <= 100 ? value : 100}%`}
            parser={(value) => value.replace("%", "")}
            className="w-full"
            onChange={(value) => setNewTaskPercentage(value)}
          />
        </div>
        {isEdit && (
          <div className="mb-2 block">
            <div>
              <span className="mb-2">Move Todo</span>
            </div>
            <Select
              placeholder="Select Todo"
              className="w-full"
              value={todoIndex}
              onChange={(value) => setTodoIndex(value)}
            >
              {todos.map((todo, index) => (
                <Select.Option key={index + 1} value={index + 1}>
                  {todo.title}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
}
