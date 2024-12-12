import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const LineConfigForm = () => {
  const [channelId, setChannelId] = useState("");
  const [channelSecret, setChannelSecret] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelId || !channelSecret) {
      toast({
        title: "エラー",
        description: "Channel IDとChannel Secretを入力してください",
        variant: "destructive",
      });
      return;
    }

    console.log("Saving LINE configuration:", { channelId, channelSecret });
    
    // Save to localStorage for development purposes
    localStorage.setItem("LINE_CHANNEL_ID", channelId);
    localStorage.setItem("LINE_CHANNEL_SECRET", channelSecret);
    
    toast({
      title: "設定を保存しました",
      description: "LINEの設定が保存されました",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center mb-6">LINE設定</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="channelId" className="text-sm font-medium">
              Channel ID
            </label>
            <Input
              id="channelId"
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="LINEのChannel IDを入力"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="channelSecret" className="text-sm font-medium">
              Channel Secret
            </label>
            <Input
              id="channelSecret"
              type="password"
              value={channelSecret}
              onChange={(e) => setChannelSecret(e.target.value)}
              placeholder="LINEのChannel Secretを入力"
            />
          </div>

          <Button type="submit" className="w-full">
            設定を保存
          </Button>
        </form>
      </div>
    </div>
  );
};