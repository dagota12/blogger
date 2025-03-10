import { Route, Routes } from "react-router";
import PostsList from "./components/PostsList";
import NotFound from "./components/NotFound";
import Post from "./components/Post";
import { PostProvider } from "./contexts/PostContext";
import AuthProvider from "./contexts/AuthContext";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route element={<AuthProvider />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<PostsList />} />
          <Route
            path="/posts/:id"
            element={
              <PostProvider>
                <Post />
              </PostProvider>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
