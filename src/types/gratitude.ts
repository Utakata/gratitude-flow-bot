export interface GratitudeEntry {
  id: string;
  userId: string;
  content: string;
  date: string;
  createdAt: string;
}

export interface AdminComment {
  id: string;
  entryId: string;
  content: string;
  createdAt: string;
  adminId: string;
}

export interface AdminCommentNotification {
  commentId: string;
  entryId: string;
  userId: string;
  lineUserId?: string;
  status: 'pending' | 'sent' | 'failed';
}