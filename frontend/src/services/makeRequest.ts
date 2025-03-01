import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export function makeRequest(
  url: string,
  options: AxiosRequestConfig<any> | undefined
) {
  return api(url, options)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err?.response?.data?.message ?? "Error!"));
}
