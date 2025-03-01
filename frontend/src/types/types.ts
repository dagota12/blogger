export type Post = {
  id: string;
  title: string;
  body: string;
  comments: Comment[]; // ✅ One-to-Many relation with Comment
};

export type User = {
  id: string;
  name: string;
  comments: Comment[]; // ✅ One-to-Many relation with Comment
  likes: Like[]; // ✅ One-to-Many relation with Like
};

export type Comment = {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  user: User; // ✅ Many-to-One relation with User
  userId: string;
  post: Post; // ✅ Many-to-One relation with Post
  postId: string;

  parent?: Comment | null; // ✅ Recursive self-relation (Parent)
  children: Comment[]; // ✅ Recursive self-relation (Children)
  parentId?: string | null;

  likes: Like[]; // ✅ One-to-Many relation with Like
  likeCount: number;
  liked: boolean;
};

export type Like = {
  user: User; // ✅ Many-to-One relation with User
  comment: Comment; // ✅ Many-to-One relation with Comment
  userId: string;
  commentId: string;
};
