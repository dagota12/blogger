import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

interface Props {
  children?: React.ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <div className="w-full">
      <Navbar />
      {children || <Outlet />}
    </div>
  );
};

export default Layout;
