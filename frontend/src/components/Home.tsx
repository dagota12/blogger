import { useRef } from "react";
import Editor from "./Editor";
import PostsList from "./PostsList";
import { useAsyncFn } from "../hooks/useAsync";
import { insertPost } from "../services/posts.srvs";
import { Post } from "../types/types";

const Home = () => {
  const innerRef = useRef(null);
  const { execute, loading } = useAsyncFn<Post>(insertPost);

  const onSubmit = async (title: string, body: string) => {
    console.log({ title, body });
    await execute(title, body).then(console.log).catch(console.log);
  };
  return (
    <div className="relative px-10 md:flex h-fit min-h-screen top-20 py-20 bg-gray-900 text-slate-300">
      <Editor
        variant="submit"
        onSubmit={onSubmit}
        onCancle={() => {}}
        defaultTitle="title"
        defaultvalue={[]}
        loading={loading}
        innerRef={innerRef}
        placeholder="type"
      />
      <PostsList />
    </div>
  );
};

export default Home;
