import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Button = ({ icon, children, className, ...props }: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "justify-center cursor-pointer text-gray-900 bg-white hover:opacity-80 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600  dark:border-gray-700 dark:text-white  me-2 mb-2",
        className
      )}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default Button;
