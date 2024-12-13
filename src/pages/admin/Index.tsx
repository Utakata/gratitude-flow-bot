import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminGratitudeList } from "@/components/admin/AdminGratitudeList";
import { AdminSettingsPanel } from "@/components/admin/AdminSettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

const AdminPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { isAdmin, isLoading } = useIsAdmin(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white flex items-center justify-center">
        <div className="text-gratitude-900">読み込み中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gratitude-900">
          管理者ページ
        </h1>
        
        <Tabs defaultValue="entries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entries">投稿一覧</TabsTrigger>
            <TabsTrigger value="settings">API設定</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries">
            <AdminGratitudeList />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;