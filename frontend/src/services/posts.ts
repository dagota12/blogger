import { makeRequest } from "./makeRequest";

export function getPosts(): Promise<any[]> {
  return makeRequest("/posts", {});
}
