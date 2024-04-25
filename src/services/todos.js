import axios from "axios";

const RAKAMIN_TODO_URL = import.meta.env.VITE_RAKAMIN_TODO

export const fetchTodos = async () => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const url = RAKAMIN_TODO_URL;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch todos.");
  }
};

export const createTodo = async (title, description) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const url = RAKAMIN_TODO_URL;

  try {
    const response = await axios.post(url, {
      title,
      description
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to create todo.");
  }
};

export const fetchItem = async (i) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const url = RAKAMIN_TODO_URL;

  try {
    const response = await axios.get(`${url}/${i}/items`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) 

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch todos.");
  }
};
