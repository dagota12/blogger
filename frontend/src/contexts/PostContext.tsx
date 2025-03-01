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
  deleteLocalComment: (id: string) => void;
  updateLikeCount: (id: string, addLike: boolean) => void;
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
    console.log("sdf");

    setComments((prev) => {
      return prev.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        }

        return comment;
      });
    });
  };
  const updateLikeCount = (id: string, addLike: boolean) => {
    setComments((prev) => {
      return prev.map((comment) => {
        const updatedCount = addLike
          ? comment.likeCount + 1
          : comment.likeCount - 1;
        if (comment.id == id) {
          return { ...comment, liked: addLike, likeCount: updatedCount };
        }
        return comment;
      });
    });
  };
  const deleteLocalComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id != id));
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
        deleteLocalComment,
        updateLikeCount,
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
