import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts.srvs";
import { Comment, Post } from "../types/types";

interface PostContextProps {
  post: Post | null;
  rootComments: Comment[];
  getReplies: (id: string) => Comment[];
  refetchPost: () => void;
  createLocalComment: (comment: Comment) => void;
  updateLocalComment: (id: string, comment: string) => void;
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
    execute: refetchFn,
  } = useAsync<Post>(() => getPost(postId), [postId]);

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!post?.comments) return;
    setComments(post?.comments);
  }, [post?.comments]);

  const commetsByParentId = useMemo(() => {
    const group: Record<string, any> = {};

    if (!comments) return {};

    comments.forEach((comment) => {
      const key = comment.parentId ?? "null";
      group[key] ||= [];
      group[key].push(comment);
    });

    return group;
  }, [comments]);

  const getReplies = (id: string) => {
    return commetsByParentId[id];
  };
  const createLocalComment = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
  };
  const updateLocalComment = (id: string, message: string) => {
    setComments((prev) => {
      return prev.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        }

        return comment;
      });
    });
  };

  // console.log("groups", commetsByParentId);

  if (loading || error) return;

  return (
    <PostContext.Provider
      value={{
        post: post,
        rootComments: commetsByParentId["null"],
        getReplies,
        refetchPost: refetchFn,
        updateLocalComment,
        createLocalComment,
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
