import { makeRequest } from "./makeRequest";

export function postComment({ postId, message, parentId }: any) {
  return makeRequest(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, postId, parentId },
  });
}
export function toggleLikeComment({ id, postId }: any) {
  return makeRequest(`posts/${postId}/comments/${id}/like`, {
    method: "POST",
  });
}

export function updateComment({ postId, id, message }: any) {
  return makeRequest(`/posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: {
      message,
    },
  });
}

export function deleteComment({ postId, id }: any) {
  return makeRequest(`/posts/${postId}/comments/${id}`, {
    method: "DELETE",
  });
}
