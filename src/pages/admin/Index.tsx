import { AdminGratitudeList } from "@/components/admin/AdminGratitudeList";
import { AdminSettingsPanel } from "@/components/admin/AdminSettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
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