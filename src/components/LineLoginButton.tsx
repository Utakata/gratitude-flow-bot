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
        // First check if LIFF is initialized
        if (!window.liff) {
          console.error("LIFF SDK is not loaded");
          throw new Error("LIFF SDK is not loaded");
        }

        // Initialize LIFF with detailed logging
        console.log("Starting LIFF initialization...");
        await window.liff.init({
          liffId: "2006661142-8mJDn7rG", // Your new LIFF ID
          withLoginOnExternalBrowser: true
        });
        
        console.log("LIFF initialization succeeded");

        // Get and log LIFF context for debugging
        const context = await window.liff.getContext();
        console.log("LIFF context:", context);
        
        // Log additional LIFF information for debugging
        console.log("LIFF OS:", window.liff.getOS());
        console.log("LIFF Language:", window.liff.getLanguage());
        console.log("LIFF isInClient:", window.liff.isInClient());
        console.log("LIFF isLoggedIn:", window.liff.isLoggedIn());
        
      } catch (err: any) {
        console.error("LIFF initialization failed:", err);
        // Log detailed error information
        if (err.response) {
          console.error("Error response:", err.response);
        }
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
        
        // Use the exact redirect URI that's registered in LINE Developers console
        const redirectUri = 'https://preview--gratitude-flow-bot.lovable.app/callback';
        
        // Debug logs for troubleshooting
        console.log('Starting LINE login process...');
        console.log('Using redirect URI:', redirectUri);

        // Login using LIFF with all required scopes
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