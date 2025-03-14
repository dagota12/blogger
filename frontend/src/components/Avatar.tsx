import { useAuth } from "../store/auth.store";

// interface Props {
//   profile_img?: string;
//   name: string;
//   handleClick: () => void;
// }
export const Avatar = () => {
  const user = useAuth((state) => state.user);
  return (
    <div className="flex items-center bg-inherite gap-2 rounded-md py-1 px-2 cursor-pointer">
      <button
        type="button"
        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded="false"
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="bottom"
      >
        <span className="sr-only">Open user menu</span>
        {user?.profile_img ? (
          <img
            className="w-8 h-8 rounded-full"
            src={user?.profile_img}
            alt="user photo"
          />
        ) : (
          <div className="flex uppercase items-center justify-center bg-slate-300 w-10 bg-cover h-10 rounded-full">
            {user?.name[0]}
          </div>
        )}
      </button>

      {/* <p className=" text-sm text-zinc-500 capitalize">{user?.name}</p> */}
    </div>
  );
};
