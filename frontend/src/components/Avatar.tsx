import { useAuth } from "../store/auth.store";

interface Props {
  profile_img?: string;
  name: string;
  handleClick: () => void;
}
export const Avatar = () => {
  const user = useAuth((state) => state.user);
  return (
    <div className="flex items-center bg-slate-200 gap-2 rounded-md py-1 px-2 cursor-pointer">
      {user?.profile_img ? (
        <img
          src={user?.profile_img}
          alt="profile"
          className="w-10 bg-cover h-10 rounded-full"
        />
      ) : (
        <div className="flex uppercase items-center justify-center bg-slate-300 w-10 bg-cover h-10 rounded-full">
          {user?.name[0]}
        </div>
      )}

      <p className=" text-sm text-zinc-500 capitalize">{user?.name}</p>
    </div>
  );
};
