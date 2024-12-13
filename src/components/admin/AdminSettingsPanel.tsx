import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const AdminSettingsPanel = () => {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [lineChannelSecret, setLineChannelSecret] = useState("");
  const [lineMessagingToken, setLineMessagingToken] = useState("");
  const { toast } = useToast();

  const handleSaveSecret = async (secretName: string, value: string) => {
    if (!value) {
      toast({
        title: "エラー",
        description: "値を入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/secrets/${secretName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) throw new Error("保存に失敗しました");

      toast({
        title: "成功",
        description: "保存しました",
      });

      // Reset the input field after successful save
      switch (secretName) {
        case "GEMINI_API_KEY":
          setGeminiApiKey("");
          break;
        case "LINE_CHANNEL_SECRET":
          setLineChannelSecret("");
          break;
        case "LINE_CHANNEL_ACCESS_TOKEN":
          setLineMessagingToken("");
          break;
      }
    } catch (error) {
      console.error("Error saving secret:", error);
      toast({
        title: "エラー",
        description: "保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Gemini API Key</h3>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter Gemini API Key"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => handleSaveSecret("GEMINI_API_KEY", geminiApiKey)}
              >
                保存
              </Button>
            </div>
          </div>

          <Separator />

          {/* LINE Channel Secret */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">LINE Channel Secret</h3>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter LINE Channel Secret"
                value={lineChannelSecret}
                onChange={(e) => setLineChannelSecret(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() =>
                  handleSaveSecret("LINE_CHANNEL_SECRET", lineChannelSecret)
                }
              >
                保存
              </Button>
            </div>
          </div>

          <Separator />

          {/* LINE Messaging API Token */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">LINE Messaging API Token</h3>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter LINE Channel Access Token"
                value={lineMessagingToken}
                onChange={(e) => setLineMessagingToken(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() =>
                  handleSaveSecret(
                    "LINE_CHANNEL_ACCESS_TOKEN",
                    lineMessagingToken
                  )
                }
              >
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};