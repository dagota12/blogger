import { Route, Routes } from "react-router";
import PostsList from "./components/PostsList";
import NotFound from "./components/NotFound";
import Post from "./components/Post";
import { PostProvider } from "./contexts/PostContext";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostsList />} />
      <Route
        path="/posts/:id"
        element={
          <PostProvider>
            <Post />
          </PostProvider>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
