import { makeRequest } from "./makeRequest";

export function getUser() {
  return makeRequest("/auth/me", {});
}
export function userLogin({ data }: any) {
  return makeRequest("/auth/login", {
    method: "POST",
    data,
  });
}
export function userSignup({ data }: any) {
  return makeRequest("/auth/signup", {
    method: "POST",
    data,
  });
}
