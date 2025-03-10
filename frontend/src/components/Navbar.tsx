import { Link } from "react-router";
import { Avatar } from "./Avatar";

const Navbar = () => {
  return (
    <nav className="w-full h-[60px] bg-slate-100 flex items-center justify-between p-4">
      <div>
        <Link to={"/"} className="text-2xl font-bold">
          <h1>Home</h1>
        </Link>
      </div>
      <Avatar />
    </nav>
  );
};

export default Navbar;
