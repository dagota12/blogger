import { usePost } from "../contexts/PostContext";
import { useAsyncFn } from "../hooks/useAsync";
import { postComment } from "../services/comment.srvs";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

const Post = () => {
  const { post, rootComments } = usePost();
  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn<any>(postComment);

  const onSubmit = (message: string) => {
    if (!createCommentFn) return;
    return createCommentFn({ postId: post?.id, message });
  };
  if (!post) return;
  return (
    <div className="container mx-auto">
      <div className="w-full p-3">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <article className="text-slate-600">{post.body}</article>
      </div>
      <section className="mt-3">
        <CommentForm
          loading={loading}
          error={error}
          autoFocus={false}
          onSubmit={onSubmit}
        />
        <h1 className="text-3xl font-semibold">comments </h1>
        <div className="mt-4">
          <CommentsList comments={rootComments ?? []} />
        </div>
      </section>
    </div>
  );
};

export default Post;
