import axios from "axios";

const RAKAMIN_TODO_URL = import.meta.env.VITE_RAKAMIN_TODO;

const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

const isTokenExpired = (token) => {
  return !token;
};

const prepareRequest = async (config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    if (isTokenExpired(token)) {
      removeAuthToken();
    }

    config.headers.Authorization = `Bearer ${token}`;
  } else {
    removeAuthToken();
    console.log("Authentication token not found. Reloading page...");
  }

  return config;
};

const rakaminUrl = axios.create({
  baseURL: RAKAMIN_TODO_URL,
});

rakaminUrl.interceptors.request.use(
  async (config) => await prepareRequest(config),
  (error) => {
    return Promise.reject(error);
  }
);

rakaminUrl.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      if (error.response && error.response.status === 422) {
      removeAuthToken();
    }
    return Promise.reject(error);
  }
  }
);

export default rakaminUrl;
