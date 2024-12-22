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
    // Initialize LIFF on component mount
    const initializeLiff = async () => {
      try {
        await window.liff.init({
          liffId: "2003632166",
          withLoginOnExternalBrowser: true
        });
        console.log("LIFF initialization succeeded");
      } catch (err: any) {
        console.error("LIFF initialization failed:", err);
        toast({
          variant: "destructive",
          title: "エラー",
          description: "LIFFの初期化に失敗しました。",
        });
      }
    };

    // Load LIFF SDK
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
        // Generate random state for CSRF protection
        const state = Math.random().toString(36).substring(7);
        localStorage.setItem('line_state', state);
        
        // Hardcode the exact redirect URI that's registered in LINE Developers console
        const redirectUri = 'https://preview--gratitude-flow-bot.lovable.app/callback';
        
        // Debug logs for troubleshooting
        console.log('Starting LINE login process...');
        console.log('Using redirect URI:', redirectUri);

        // Login using LIFF
        await window.liff.login({
          redirectUri: redirectUri
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