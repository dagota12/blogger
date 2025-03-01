import { Comment as CommentType } from "../types/types";
import Comment from "./Comment";
interface Props {
  comments: CommentType[];
}
const CommentsList = ({ comments }: Props) => {
  return comments.map((comment) => (
    <div key={comment.id} className="pl-2">
      <Comment {...comment} />
    </div>
  ));
};

export default CommentsList;
