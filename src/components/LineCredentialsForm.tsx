import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const LineCredentialsForm = () => {
  const [channelSecret, setChannelSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const { toast } = useToast();

  const handleSave = async (type: "secret" | "token") => {
    const value = type === "secret" ? channelSecret : accessToken;
    if (!value) {
      toast({
        title: "エラー",
        description: "値を入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/secrets/${type === "secret" ? "LINE_CHANNEL_SECRET" : "LINE_CHANNEL_ACCESS_TOKEN"}`, {
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

      if (type === "secret") {
        setChannelSecret("");
      } else {
        setAccessToken("");
      }
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
      <Card>
        <CardHeader>
          <CardTitle>LINE Developers Console</CardTitle>
          <CardDescription>Enter API Keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">LINE_CHANNEL_SECRET</h3>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter LINE_CHANNEL_SECRET"
                value={channelSecret}
                onChange={(e) => setChannelSecret(e.target.value)}
              />
              <Button variant="outline" onClick={() => handleSave("secret")}>
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">LINE_CHANNEL_ACCESS_TOKEN</h3>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter LINE_CHANNEL_ACCESS_TOKEN"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
              <Button variant="outline" onClick={() => handleSave("token")}>
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};