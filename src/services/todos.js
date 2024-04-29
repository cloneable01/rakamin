import rakaminUrl from '../helper/http';

export const fetchTodos = async () => {
  try {
    const response = await rakaminUrl.get('/');
    return response.data;
  } catch (error) {
    console.log("Failed to fetch todos:", error);
  }
};

export const createTodo = async (title, description) => {
  try {
    const response = await rakaminUrl.post('/', { title, description });
    return response.data;
  } catch (error) {
    console.log("Failed to create todo:", error);
  }
};

export const fetchItem = async (i) => {
  try {
    const response = await rakaminUrl.get(`/${i}/items`);
    return response.data;
  } catch (error) {
    console.log('Failed to fetch task:', error);
  }
};

export const createItem = async (url, data) => {
  try {
    const response = await rakaminUrl.post(`/${url}`, data);
    return response.data;
  } catch (error) {
    console.log('Failed to create task:', error);
  }
};

export const patchItem = async (todoIndex, itemId, newData) => {
  try {
    const response = await rakaminUrl.patch(`/${todoIndex}/items/${itemId}`, newData);
    return response.data;
  } catch (error) {
    console.log(`Failed to patch task: ${error}`);
  }
};

export const deleteItem = async (todoIndex, itemId) => {
  try {
    const response = await rakaminUrl.delete(`/${todoIndex}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.log(`Failed to delete task: ${error}`);
  }
};
