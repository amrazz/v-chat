import axios from "axios";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const useApi = () => {
  const token = useSelector((state) => state.auth.access_token);

  const api = useMemo(() => {
    const instance = axios.create({
      // baseURL: `http://localhost:8000/api/`,
      baseURL: `https://v-chat-j9d2.onrender.com/api/`,
    });

    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [token]);

  return api
};

export default useApi
