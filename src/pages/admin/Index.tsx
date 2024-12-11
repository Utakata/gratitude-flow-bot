import { AdminGratitudeList } from "@/components/admin/AdminGratitudeList";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gratitude-900">
          管理者ページ
        </h1>
        <AdminGratitudeList />
      </div>
    </div>
  );
};

export default AdminPage;