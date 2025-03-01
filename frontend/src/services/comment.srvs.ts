import { makeRequest } from "./makeRequest";

export function postComment({ postId, message, parentId }) {
  return makeRequest(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
}
