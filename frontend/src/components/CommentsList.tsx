import { Comment as CommentType } from "../types/types";
import Comment from "./Comment";
interface Props {
  comments: CommentType[];
}
const CommentsList = ({ comments }: Props) => {
  return comments.map((comment) => (
    <div key={comment.id} className="px-10">
      <Comment {...comment} />
    </div>
  ));
};

export default CommentsList;
