import { Input } from "@/components/ui/input";

interface UserInfoSectionProps {
  userId: string;
  onUserIdChange: (userId: string) => void;
}

export const UserInfoSection = ({ userId, onUserIdChange }: UserInfoSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">ユーザー情報</h2>
      </div>
      <Input
        type="text"
        placeholder="ユーザーIDを入力してください"
        value={userId}
        onChange={(e) => onUserIdChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};