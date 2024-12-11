import { useState, useEffect } from "react";
import { GratitudeEntry, AdminComment } from "@/types/gratitude";
import { AdminCommentList } from "./AdminCommentList";
import { useToast } from "@/components/ui/use-toast";

export const AdminGratitudeList = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [comments, setComments] = useState<Record<string, AdminComment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
    fetchComments();
  }, []);

  const fetchEntries = async () => {
    try {
      // TODO: API実装後に実際のエンドポイントに接続
      console.log("Fetching entries...");
      // const response = await fetch('/api/admin/entries');
      // const data = await response.json();
      // setEntries(data);
      setEntries([]); // ダミーデータ
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast({
        title: "エントリーの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      // TODO: API実装後に実際のエンドポイントに接続
      console.log("Fetching comments...");
      // const response = await fetch('/api/admin/comments');
      // const data = await response.json();
      // setComments(data);
      setComments({}); // ダミーデータ
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (entryId: string, content: string) => {
    try {
      // TODO: API実装後に実際のエンドポイントに接続
      console.log("Adding comment to entry:", entryId, content);
      // const response = await fetch('/api/admin/comments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ entryId, content }),
      // });
      // const newComment = await response.json();
      
      // コメントの状態を更新
      setComments(prev => ({
        ...prev,
        [entryId]: [...(prev[entryId] || []), {
          id: Date.now().toString(),
          entryId,
          content,
          createdAt: new Date().toISOString(),
          adminId: "admin-1" // TODO: 実際の管理者IDを使用
        }]
      }));

      // TODO: LINE通知の送信
      console.log("Sending LINE notification for comment...");
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (entries.length === 0) {
    return <div className="p-4">エントリーがありません</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">感謝の気持ち一覧</h2>
      {entries.map((entry) => (
        <AdminCommentList
          key={entry.id}
          entry={entry}
          comments={comments[entry.id] || []}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
};