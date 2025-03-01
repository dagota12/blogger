import { HTMLAttributes, JSX, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  Icon: JSX.ElementType;
  active: boolean;
  color: string;
  children?: ReactNode;
}

const IconButton = ({ Icon, active, color, children, ...props }: Props) => {
  return (
    <button
      className={`p-1 flex items-center bg-inherit border-none rounded-sm text-sm cursor-pointer ${
        active ? "color-red-500" : color
      }`}
      {...props}
    >
      <span className={`${children && "mr-1"}`}>
        <Icon className="size-4" />
      </span>
      {children}
    </button>
  );
};

export default IconButton;
