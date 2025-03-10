import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string[] | undefined;
}
const Input = ({ error, label, ...props }: Props) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <h3 className="text-zinc-700 capitalize">{label}</h3>

      <input
        className="p-2 w-full h-10 focus:outline-none focus:border   bg-slate-100 rounded-md border-zinc-300"
        {...props}
      />
      {error && error[0] && (
        <p className="text-red-500 text text-left">{error}</p>
      )}
    </div>
  );
};

export default Input;
