import { GratitudeForm } from "@/components/GratitudeForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gratitude-900">
          感謝の気持ちを記録
        </h1>
        <div className="mt-8">
          <GratitudeForm />
        </div>
      </div>
    </div>
  );
};

export default Index;