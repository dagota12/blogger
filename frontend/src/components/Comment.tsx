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
  return (
    <>
      <div className="p-3 border mb-2 border-slate-400 rounded-md flex flex-col gap-2">
        <div className="flex justify-between">
          <span>{user.name}</span>
          <span>{dateFormatter.format(Date.parse(createdAt))}</span>
        </div>
        <p className="">{message}</p>

        <div className="flex gap-2"></div>
      </div>
    </>
  );
};

export default Comment;
