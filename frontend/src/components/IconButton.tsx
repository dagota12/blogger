import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: React.ElementType;
  active: boolean;
  color: string;
  children?: ReactNode;
}

const IconButton = ({ Icon, active, color, children, ...props }: Props) => {
  return (
    <button
      className={`p-1 flex items-center bg-inherit border-none rounded-sm text-sm cursor-pointer ${
        active ? color : "text-slate-300"
      }`}
      {...props}
    >
      <span className={`${children !== null && "mr-1"}`}>
        <Icon className="size-4" />
      </span>
      {children}
    </button>
  );
};

export default IconButton;
