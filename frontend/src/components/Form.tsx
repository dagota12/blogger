import React, { FormEvent } from "react";

interface Props {
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

const Form = ({ onSubmit, className, children, ...props }: Props) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex flex-col gap-5 items-center justify-center max-w-[400px] rouded-md px-5 py-4 bg-gray-800 text-slate-200 rounded-md"
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;
