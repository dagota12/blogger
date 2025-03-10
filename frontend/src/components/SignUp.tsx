import { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useAsyncFn } from "../hooks/useAsync";
import { AuthUser, useAuth } from "../store/auth.store";
import { userSignup } from "../services/auth.srvs";
import Button from "./Button";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const SignUp = () => {
  const { execute, loading } = useAsyncFn<AuthUser>(userSignup);
  const router = useNavigate();
  const user = useAuth((state) => state.user);
  if (user) {
    router("/", { replace: true });
  }
  const [formErrors, setFormErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
  }>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
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
    execute({ data }).then(console.log).catch(console.log);
    console.log();
  };
  return (
    <div className="flex w-full bg-slate-200 px-4 flex-col items-center justify-center  h-screen">
      <form
        className="w-full flex flex-col gap-3 items-center justify-center max-w-[400px] rouded-md px-3 py-4 bg-slate-50 rounded-md"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-semibold">Signup</h1>
        <Input
          type="email"
          label="email"
          error={formErrors.email}
          name="email"
          onChange={() => {}}
          placeholder="email"
        />

        <Input
          type="name"
          label="name"
          error={formErrors.name}
          name="name"
          onChange={() => {}}
          placeholder="name"
        />
        <Input
          type="password"
          label="password"
          error={formErrors.password}
          name="password"
          onChange={() => {}}
          placeholder="password"
        />
        <Button
          className="p-2 bg-zinc-700 w-full rounded-md mt-4 text-zinc-50"
          disabled={loading}
          type="submit"
        >
          submit
        </Button>
        <div>
          <p>
            have an account?{" "}
            <Link to={"/login"} className="text-blue-500">
              login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
