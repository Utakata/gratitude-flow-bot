import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

declare global {
  interface Window {
    liff: any;
  }
}

export const LineLoginButton = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        if (!window.liff) {
          console.error("LIFF SDK is not loaded");
          throw new Error("LIFF SDK is not loaded");
        }

        console.log("Starting LIFF initialization...");
        await window.liff.init({
          liffId: "2006661142-8mJDn7rG",
          withLoginOnExternalBrowser: true
        });
        
        console.log("LIFF initialization succeeded");
        console.log("LIFF isLoggedIn:", window.liff.isLoggedIn());
      } catch (err: any) {
        console.error("LIFF initialization failed:", err);
        toast({
          variant: "destructive",
          title: "エラー",
          description: "LIFFの初期化に失敗しました。",
        });
      }
    };

    const liffScript = document.createElement("script");
    liffScript.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
    liffScript.onload = () => {
      console.log("LIFF SDK loaded");
      initializeLiff();
    };
    liffScript.onerror = (err) => {
      console.error("Failed to load LIFF SDK:", err);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "LIFF SDKの読み込みに失敗しました。",
      });
    };
    document.body.appendChild(liffScript);

    return () => {
      document.body.removeChild(liffScript);
    };
  }, [toast]);

  const handleLineLogin = async () => {
    try {
      if (!window.liff.isLoggedIn()) {
        const state = Math.random().toString(36).substring(7);
        sessionStorage.setItem('line_login_state', state); // Using sessionStorage instead of localStorage
        
        const redirectUri = 'https://preview--gratitude-flow-bot.lovable.app/callback';
        console.log('Starting LINE login process with state:', state);
        console.log('Using redirect URI:', redirectUri);

        await window.liff.login({
          redirectUri: redirectUri,
          scope: "profile openid chat_message.write"
        });
      } else {
        console.log('User is already logged in');
      }
    } catch (error: any) {
      console.error('Error during LINE login:', error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "LINE認証の準備中にエラーが発生しました。",
      });
    }
  };

  return (
    <Button
      onClick={handleLineLogin}
      className="bg-[#00B900] hover:bg-[#00A000] text-white flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      LINEでログイン
    </Button>
  );
};