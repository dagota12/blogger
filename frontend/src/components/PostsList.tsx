import { getPosts } from "../services/posts.srvs";
import { Link } from "react-router";
import { useAsync } from "../hooks/useAsync";

const PostsList = () => {
  const { loading, error, data: posts } = useAsync<any[]>(getPosts);
  console.log(posts);
  if (loading || error) return;

  return (
    <div className="relative top-20 bg-gray-900 text-slate-300">
      {posts &&
        posts.map((post: any, i: number) => (
          <li key={i} className="text-blue-500">
            <Link to={`posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
    </div>
  );
};

export default PostsList;
