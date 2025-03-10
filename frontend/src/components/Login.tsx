import { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useAsyncFn } from "../hooks/useAsync";
import { AuthUser, useAuth } from "../store/auth.store";
import { userLogin } from "../services/auth.srvs";
import Button from "./Button";
import Form from "./Form";

export const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const Login = () => {
  const { execute, loading, error } = useAsyncFn<AuthUser>(userLogin);
  const router = useNavigate();
  const user = useAuth((state) => state.user);
  if (user) {
    // router("/", { replace: true });
  }
  const [formErrors, setFormErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      console.log(errors);

      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    execute({ data })
      .then(() => {
        router("/", { replace: true });
      })
      .catch(console.log);
  };
  return (
    <div className="flex w-full bg-slate-900 px-4 flex-col items-center justify-center  h-screen">
      <Form onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Login</h1>
        <Input
          type="email"
          label="email"
          error={formErrors.email}
          name="email"
          onChange={() => {}}
          placeholder="email"
        />

        <Input
          type="password"
          label="password"
          error={formErrors.password}
          name="password"
          onChange={() => {}}
          placeholder="password"
        />
        <Button disabled={loading} type="submit">
          submit
        </Button>
        <div>
          <p>
            don&apos;thave an account?{" "}
            <Link to={"/signup"} className="text-blue-500">
              signup
            </Link>
          </p>
        </div>
        {error && <p className="text-red-500">{"faild to login"}</p>}
      </Form>
    </div>
  );
};

export default Login;
