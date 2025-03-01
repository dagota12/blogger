import { useState } from "react";

interface Props {
  loading: boolean;
  error: any;
  autoFocus: boolean;
  initVal?: string;
  onSubmit: (message: string) => Promise<any>;
}

const CommentForm = ({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initVal = "",
}: Props) => {
  const [message, setMessage] = useState(initVal);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(""));
  };
  return (
    <form onSubmit={handleSubmit} className="px-2 max-w-[600px]">
      <div className="flex gap-3">
        <textarea
          autoFocus={autoFocus}
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="outline-none border border-slate-400 rounded-md flex-grow p-2 bg-slate-50"
        ></textarea>
        <button
          type="submit"
          className="px-4  py-0 rounded-md border-none bg-blue-700 text-slate-50 hover:bg-blue-500 cursor-pointer"
          disabled={loading}
        >
          comment
        </button>
      </div>
      <p className="text-red-500">{error}</p>
    </form>
  );
};

export default CommentForm;
