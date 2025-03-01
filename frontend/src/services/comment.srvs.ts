import { makeRequest } from "./makeRequest";

export function postComment({ postId, message, parentId }) {
  return makeRequest(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, postId, parentId },
  });
}

export function updateComment({ postId, id, message }) {
  return makeRequest(`/posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: {
      message,
    },
  });
}
