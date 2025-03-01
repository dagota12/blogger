import { createContext, ReactNode, useContext, useMemo } from "react";
import { useParams } from "react-router";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts.srvs";
import { Comment, Post } from "../types/types";

interface PostContextProps {
  post: Post | null;
  rootComments: Comment[];
  getReplies: (id: string) => Comment[];
}

const PostContext = createContext<PostContextProps | null>(null);

interface Props {
  children: ReactNode;
}
export function PostProvider({ children }: Props) {
  const { id: postId } = useParams();
  const {
    loading,
    data: post,
    error,
  } = useAsync<Post>(() => getPost(postId), [postId]);
  const commetsByParentId = useMemo(() => {
    const group: Record<string, any> = {};
    if (!post?.comments) return {};
    post.comments.forEach((comment) => {
      const key = comment.parentId ?? "null";
      group[key] ||= [];
      group[key].push(comment);
    });

    return group;
  }, [post?.comments]);

  const getReplies = (id: string) => {
    return commetsByParentId[id];
  };

  // console.log("groups", commetsByParentId);

  if (loading || error) return;

  return (
    <PostContext.Provider
      value={{
        post: post,
        rootComments: commetsByParentId["null"],
        getReplies,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePost must be wrapped in PostProvider");
  return { ...context };
}
