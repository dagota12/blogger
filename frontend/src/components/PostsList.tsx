import { getPosts } from "../services/posts";
import { Link } from "react-router";
import { useAsync } from "../hooks/useAsync";

const PostsList = () => {
  const { loading, error, data: posts } = useAsync<any[]>(getPosts);
  console.log(posts);
  if (loading || error) return;

  return (
    <div>
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
