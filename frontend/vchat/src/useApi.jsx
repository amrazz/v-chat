import axios from "axios";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const useApi = () => {
  const token = useSelector((state) => state.auth.access_token);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `https://${import.meta.env.VITE_BASE_URL}/api/`,
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
