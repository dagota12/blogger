import { useEffect } from "react";
import { Outlet } from "react-router";
import { AuthUser, useAuth } from "../store/auth.store";
import { useAsync } from "../hooks/useAsync";
import { getUser } from "../services/auth.srvs";

const AuthProvider = () => {
  const setUser = useAuth((state) => state.setUser);
  const { data, loading } = useAsync<AuthUser>(getUser);

  useEffect(() => {
    setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) {
    return <p>auth loading..</p>;
  }

  return <Outlet />;
};

export default AuthProvider;
