import { Post } from "../types/types";
import { makeRequest } from "./makeRequest";

export function getPosts(): Promise<any[]> {
  return makeRequest("/posts", {});
}
export function getPost(id: string | undefined): Promise<Post> {
  return makeRequest(`posts/${id}`, {});
}
export function insertPost({ title, body }: any): Promise<Post> {
  return makeRequest(`/posts`, {
    method: "POST",
    data: { title, body },
  });
}
