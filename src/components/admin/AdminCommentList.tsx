import { useState } from "react";
import { AdminComment, GratitudeEntry } from "@/types/gratitude";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle } from "lucide-react";

interface AdminCommentListProps {
  entry: GratitudeEntry;
  comments: AdminComment[];
  onAddComment: (entryId: string, content: string) => Promise<void>;
}

export const AdminCommentList = ({ entry, comments, onAddComment }: AdminCommentListProps) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      toast({
        title: "コメントを入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment(entry.id, newComment);
      setNewComment("");
      toast({
        title: "コメントを送信しました",
        description: "ユーザーにLINEで通知されます",
      });
    } catch (error) {
      console.error("Error sending comment:", error);
      toast({
        title: "コメントの送信に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-2">
        <h3 className="font-semibold">エントリー内容</h3>
        <p className="text-gray-700">{entry.content}</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          コメント一覧
        </h4>
        
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">まだコメントはありません</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="新しいコメントを入力..."
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "送信中..." : "コメントを送信"}
          </Button>
        </div>
      </div>
    </div>
  );
};