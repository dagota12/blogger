import {
  DotIcon,
  EditIcon,
  HeartIcon,
  PlusCircleIcon,
  ReplyIcon,
  TrashIcon,
} from "lucide-react";
import IconButton from "./IconButton";
import { usePost } from "../contexts/PostContext";
import { useState } from "react";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import {
  deleteComment,
  toggleLikeComment,
  postComment,
  updateComment,
} from "../services/comment.srvs";
import { Comment as CommentType } from "../types/types";

const dateFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
interface Props extends CommentType {}
const Comment = ({ id, message, user, createdAt, liked, likeCount }: Props) => {
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    updateLikeCount,
  } = usePost();
  const [hideReplies, setHideReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    execute: createCommentReply,
    loading: replyLoading,
    error: replyError,
  } = useAsyncFn(postComment);

  const {
    execute: commetUpdater,
    loading: updateLoading,
    error: updateError,
  } = useAsyncFn(updateComment);

  const { execute: deleteCommentFn, loading: deletingComment } =
    useAsyncFn(deleteComment);

  const { execute: toggleLikeCommentFn, loading: likingComment } =
    useAsyncFn(toggleLikeComment);

  const onUpdateComment = (message: string): Promise<any> => {
    return commetUpdater({ postId: post?.id, id, message }).then(
      ({ message }) => {
        setIsEditing(false);
        console.log(message);

        updateLocalComment(id, message);
      }
    );
  };
  const onCommentReply = (message: string): Promise<any> => {
    return createCommentReply({ postId: post?.id, message, parentId: id }).then(
      (comment) => {
        setIsReplying(false);
        setHideReplies(false);
        createLocalComment(comment);
      }
    );
  };
  const onCommentDelete = (id: string): Promise<any> => {
    return deleteCommentFn({ id, postId: post?.id }).then((res) => {
      console.log("del", res);
      deleteLocalComment(id);
    });
  };
  const onlikeComment = () => {
    toggleLikeCommentFn({ postId: post?.id, id }).then((res) => {
      console.log(res);
      updateLikeCount(id, res.addLike);
    });
  };
  const childComments = getReplies(id);
  return (
    <>
      <div className="px-3 py-2 bg-slate-900 border-l   mb-2 border-slate-700 rounded-md flex flex-col gap-2 max-w-[600px]">
        <div className="flex  items-center">
          <span className="text-sm font-semibold text-zinc-400">
            {user.name}
          </span>
          <DotIcon className="text-slate-500" />
          <span className="text-sm text-slate-500">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            initVal={message}
            autoFocus
            loading={updateLoading}
            error={updateError}
            onSubmit={onUpdateComment}
          />
        ) : (
          <p className="">{message}</p>
        )}

        <div className="flex gap-0">
          <IconButton
            disabled={likingComment}
            onClick={() => onlikeComment()}
            Icon={HeartIcon}
            active={liked}
            color="text-blue-500 font-bold"
          >
            {likeCount}
          </IconButton>
          <IconButton
            disabled={replyLoading}
            onClick={() => setIsReplying((prev) => !prev)}
            Icon={ReplyIcon}
            active={isReplying}
            color="text-blue-900"
          />
          <IconButton
            disabled={updateLoading}
            onClick={() => setIsEditing((prev) => !prev)}
            Icon={EditIcon}
            active={isEditing}
            color="text-blue-600"
          />
          <IconButton
            disabled={deletingComment}
            Icon={TrashIcon}
            onClick={() => onCommentDelete(id)}
            active={true}
            color="text-red-500"
          />
        </div>
      </div>
      {isReplying && (
        <div className="my-1">
          <CommentForm
            autoFocus
            loading={replyLoading}
            initVal=""
            error={replyError}
            onSubmit={onCommentReply}
          />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div className={`${hideReplies ? "hidden" : "flex grow pl-1"}`}>
            {/* vertical divider for hide */}
            <button
              className="border-none bg-slate-700 w-2 mt-1 relative outlien-none cursor-pointer"
              onClick={() => setHideReplies(true)}
            />
            <div className="grow">
              <CommentsList comments={childComments} />
            </div>
          </div>
          <button
            className={`p-1 cursor-pointer border-blue-300 text-xs rounded-md mt-1 ${
              !hideReplies ? "hidden" : "block"
            }`}
            onClick={() => setHideReplies(false)}
          >
            <PlusCircleIcon className="size-5 text-blue-500" />
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
