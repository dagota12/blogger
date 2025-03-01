import { EditIcon, HeartIcon, ReplyIcon, TrashIcon } from "lucide-react";
import IconButton from "./IconButton";
import { usePost } from "../contexts/PostContext";
import { useState } from "react";
import CommentsList from "./CommentsList";

const dateFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});
interface Props {
  id: string;
  message: string;
  user: any;
  createdAt: string;
}
const Comment = ({ id, message, user, createdAt }: Props) => {
  const { getReplies } = usePost();
  const [hideReplies, setHideReplies] = useState(true);
  const childComments = getReplies(id);
  return (
    <>
      <div className="px-3 py-2 border mb-2 border-slate-400 rounded-md flex flex-col gap-2">
        <div className="flex justify-between">
          <span>{user.name}</span>
          <span>{dateFormatter.format(Date.parse(createdAt))}</span>
        </div>
        <p className="">{message}</p>

        <div className="flex gap-1">
          <IconButton Icon={HeartIcon} active={false} color="text-blue-900">
            2
          </IconButton>
          <IconButton Icon={ReplyIcon} active={false} color="text-blue-900" />
          <IconButton Icon={EditIcon} active={false} color="text-blue-900" />
          <IconButton Icon={TrashIcon} active={false} color="text-red-500" />
        </div>
      </div>

      {childComments?.length > 0 && (
        <>
          <div className={`${hideReplies ? "hidden" : "flex grow pl-1"}`}>
            {/* vertical divider for hide */}
            <button
              className="border-none bg-blue-100 w-2 mt-1 relative outlien-none cursor-pointer"
              onClick={() => setHideReplies(true)}
            />
            <div className="grow">
              <CommentsList comments={childComments} />
            </div>
          </div>
          <button
            className={`p-2 border cursor-pointer border-blue-300 text-sm rounded-md mt-1 ${
              !hideReplies ? "hidden" : "block"
            }`}
            onClick={() => setHideReplies(false)}
          >
            show replies
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
