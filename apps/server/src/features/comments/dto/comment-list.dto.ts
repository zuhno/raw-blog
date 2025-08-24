export type TCommentNode = {
  id: number;
  text: string;
  authorId: number;
  contentId: number;
  parentId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  author: { id: number; nickname: string; avatarUrl?: string };
  children: TCommentNode[];
};
