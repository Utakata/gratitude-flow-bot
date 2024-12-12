import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const LineCredentialsForm = () => {
  const [channelSecret, setChannelSecret] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    if (!channelSecret) {
      toast({
        title: "エラー",
        description: "値を入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/secrets/LINE_CHANNEL_SECRET", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: channelSecret }),
      });

      if (!response.ok) throw new Error("保存に失敗しました");

      toast({
        title: "成功",
        description: "保存しました",
      });

      setChannelSecret("");
    } catch (error) {
      toast({
        title: "エラー",
        description: "保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto p-4">
      <div className="flex space-x-2">
        <Input
          type="password"
          placeholder="Enter LINE_CHANNEL_SECRET"
          value={channelSecret}
          onChange={(e) => setChannelSecret(e.target.value)}
        />
        <Button variant="outline" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};