import { getPosts } from "../services/posts.srvs";
import { Link } from "react-router";
import { useAsync } from "../hooks/useAsync";
import { Post } from "../types/types";

const PostsList = () => {
  const { loading, error, data: posts } = useAsync<Post[]>(getPosts);
  console.log(posts);
  if (loading || error) return;

  return (
    <div className="relative bg-slate-900  px-2 min-h-full flex flex-col gap-3 items-center min-w-1/2 top-10 md:top-0  text-slate-300">
      {posts &&
        posts.map((post: Post, i: number) => (
          <div
            className="flex flex-col rounded-lg bg-slate-800 w-full p-4 md:p-10"
            key={post.id}
          >
            <div>
              <Link className="text-blue-400" to={`posts/${post.id}`}>
                {post.title}
              </Link>
              <p className="max-w-[300px] truncate">{post.body}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PostsList;
