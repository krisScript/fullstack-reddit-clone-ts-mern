import Comment from '@rddt/common/types/Comment';
import { Document } from 'mongoose';
interface ExtendedComment extends Comment {
  user: string;
}
type CommentType = ExtendedComment & Document;
export default CommentType;
