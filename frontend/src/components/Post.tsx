import { usePost } from "../contexts/PostContext";
import { useAsyncFn } from "../hooks/useAsync";
import { postComment } from "../services/comment.srvs";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

const Post = () => {
  const { post, rootComments, createLocalComment } = usePost();
  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn<any>(postComment);

  const onSubmit = (message: string): Promise<any> => {
    if (!createCommentFn) return Promise.reject("fail");
    return createCommentFn({ postId: post?.id, message }).then((res) => {
      console.log("comenting", res);

      createLocalComment(res);
    });
  };

  if (!post) return <h1>loading...</h1>;
  return (
    <div className="text-slate-300 relative top-20 w-full py-10 min-h-screen md:px-10 mx-auto bg-gray-900">
      <div className="w-full p-3">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <article className="text-slate-500 max-w-[1000px]">{post.body}</article>
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
