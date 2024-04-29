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
  Alert,
} from "antd";
import Task from "../components/Task";
import Label from "../components/Label";
import {
  fetchTodos,
  fetchItem,
  createItem,
  patchItem,
  deleteItem,
} from "../services/todos";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [tasks, setTasks] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [todoIndex, setTodoIndex] = useState(0);
  const [targetTodos, setTargetTodos] = useState(0);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPercentage, setNewTaskPercentage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("authToken")
  );
  const types = ["default", "warning", "danger", "success"];

  const fetchData = async () => {
    try {
      const todosData = await fetchTodos();
      setTodos(todosData);

      const tasksData = {};
      await Promise.all(
        todosData.map(async (_, i) => {
          const todoId = Number([i]) + 1;
          const taskItem = await fetchItem(todoId);
          tasksData[todoId] = taskItem;
        })
      );

      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to fetch todos 1:", error.message);
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
      setAlertMessage("Task deleted!");
      setAlertType("success");
      fetchData();
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to delete task: " + error.message);
    }
  };

  const handleCreateTask = async (index, id) => {
    if (!isEdit) {
      try {
        const url = `${index}/items`;
        await createItem(url, {
          name: newTaskName,
          progress_percentage: newTaskPercentage,
        });
        setAlertMessage("Task created!");
        setAlertType("success");
        fetchData();
        handleModalVisibility(false);
      } catch (error) {
        setAlertType("error");
        setAlertMessage("Failed to create task: " + error.message);
      }
    } else {
      try {
        const url = `${index}`;
        await patchItem(url, id, {
          target_todo_id: targetTodos,
          name: newTaskName,
          progress_percentage: newTaskPercentage,
        });
        setAlertMessage("Task updated!");
        setAlertType("success");
        fetchData();
        handleModalVisibility(false);
      } catch (error) {
        setAlertType("error");
        setAlertMessage("Failed to update task: " + error.message);
      }
    }
  };

  const handleDragStart = (e, taskId, sourceTodoIndex, sourceTaskIndex) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceTodoIndex", sourceTodoIndex);
    e.dataTransfer.setData("sourceTaskIndex", sourceTaskIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, destinationTodoIndex, destinationTaskIndex) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");
    const sourceTodoIndex = parseInt(
      e.dataTransfer.getData("sourceTodoIndex"),
      10
    );
    const sourceTaskIndex = parseInt(
      e.dataTransfer.getData("sourceTaskIndex"),
      10
    );

    if (
      sourceTodoIndex !== destinationTodoIndex ||
      sourceTaskIndex !== destinationTaskIndex
    ) {
      const sourceTasks = [...tasks[sourceTodoIndex]];
      const [draggedTask] = sourceTasks.splice(sourceTaskIndex, 1);
      const destinationTasks = [...tasks[destinationTodoIndex]];
      destinationTasks.splice(destinationTaskIndex, 0, draggedTask);

      const updatedTasks = { ...tasks };
      updatedTasks[sourceTodoIndex] = sourceTasks;
      updatedTasks[destinationTodoIndex] = destinationTasks;
      setTasks(updatedTasks);
      const newTargetTodoId = destinationTodoIndex;
      patchItem(sourceTodoIndex, taskId, {
        target_todo_id: newTargetTodoId,
      })
        .then(() => {
          setAlertMessage("Task updated!");
          setAlertType("success");
          fetchData();
        })
        .catch((error) => {
          setAlertType("error");
          setAlertMessage("Failed to update task: " + error.message);
        });
    }
  };

  const menuItems = (
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
          draggable
          key={todo.id}
          type={types[index % types.length]}
          className="w-[350px] min-w-[350px] mx-4 mb-12"
          onDrop={(e) => handleDrop(e, index + 1, tasks[index + 1].length)}
          onDragOver={(e) => handleDragOver(e)}
        >
          <Label type={types[index % types.length]}>{todo.title}</Label>
          <div className="my-4">{todo.description}</div>
          {tasks[index + 1] && tasks[index + 1].length > 0 ? (
            <ul>
              {tasks[index + 1].map((task, taskIndex) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, task.id, index + 1, taskIndex)
                  }
                >
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
                      <div
                        onMouseEnter={() => {
                          setTaskId(task.id);
                          setTodoIndex(Number(index) + 1);
                          setNewTaskName(task.name);
                          setNewTaskPercentage(task.progress_percentage);
                        }}
                      >
                        <Dropdown arrow overlay={menuItems}>
                          <button className="text-black">...</button>
                        </Dropdown>
                      </div>
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

      {alertMessage && (
        <Alert message={alertMessage} type={alertType} showIcon />
      )}

      <Modal
        title={`${isEdit ? "Edit" : "Create new"} task`}
        open={isModalVisible}
        onCancel={() => {
          handleModalVisibility(false);
          setTodoIndex(0);
          setIsEdit(false);
          setNewTaskName("");
          setNewTaskPercentage(0);
          setTargetTodos(0);
        }}
        onOk={() => {
          handleModalVisibility(false);
          handleCreateTask(todoIndex, taskId);
          setIsEdit(false);
          setNewTaskName("");
          setNewTaskPercentage(0);
          setTargetTodos(0);
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
            formatter={(value) => `${value <= 100 ? value : 100}`}
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
              onChange={(value) => setTargetTodos(value)}
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
