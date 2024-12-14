import { useEffect, useState } from "react";
import { GratitudeForm } from "@/components/GratitudeForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserCheck, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CHANNEL_ID = "YOUR_LINE_CHANNEL_ID"; // You'll need to replace this with your LINE Channel ID
const REDIRECT_URI = encodeURIComponent(window.location.origin);

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginInfo, setShowLoginInfo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check URL parameters for LINE login response
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code) {
      // Verify state to prevent CSRF attacks
      const savedState = localStorage.getItem('line_state');
      if (state === savedState) {
        handleLineCallback(code);
      } else {
        toast({
          variant: "destructive",
          title: "セキュリティエラー",
          description: "不正なリクエストです。もう一度ログインしてください。",
        });
      }
      localStorage.removeItem('line_state');
    }

    // Check if user is already logged in
    const checkAuth = async () => {
      const session = localStorage.getItem('line_user');
      if (session) {
        try {
          const userData = JSON.parse(session);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing session:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [toast]);

  const handleLineCallback = async (code: string) => {
    try {
      // Exchange authorization code for access token using Edge Function
      const response = await fetch('/api/line/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUri: window.location.origin }),
      });

      if (!response.ok) {
        throw new Error('認証に失敗しました');
      }

      const data = await response.json();
      
      // Store user data in localStorage
      localStorage.setItem('line_user', JSON.stringify(data.user));
      setUser(data.user);
      
      // Remove code from URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);

      toast({
        title: "ログインしました",
        description: `ようこそ、${data.user.displayName}さん`,
      });
    } catch (error: any) {
      console.error('Error during LINE callback:', error);
      toast({
        variant: "destructive",
        title: "ログインエラー",
        description: error.message,
      });
    }
  };

  const handleLogin = () => {
    setShowLoginInfo(true);
  };

  const proceedWithLogin = () => {
    // Generate random state for security
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('line_state', state);

    // Construct LINE login URL
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code` +
      `&client_id=${CHANNEL_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&state=${state}` +
      `&scope=profile`;

    // Redirect to LINE login
    window.location.href = lineLoginUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('line_user');
    setUser(null);
    toast({
      title: "ログアウトしました",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white flex items-center justify-center">
        <div className="text-gratitude-900">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gratitude-900">
            感謝の気持ちを記録
          </h1>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-gratitude-600">
                  <UserCheck className="h-5 w-5" />
                  <span>ログイン中</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  ログアウト
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-[#00B900] hover:bg-[#00A000]"
              >
                <LogIn className="h-4 w-4" />
                LINEでログイン
              </Button>
            )}
          </div>
        </div>

        {showLoginInfo && !user && (
          <Alert className="mb-8">
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              LINEログインには2段階認証が必要です。スマートフォンのLINEアプリが必要になりますので、ご準備ください。
              <div className="mt-4">
                <Button onClick={proceedWithLogin} className="bg-[#00B900] hover:bg-[#00A000]">
                  続ける
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {user ? (
          <div className="mt-8">
            <GratitudeForm />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gratitude-800 text-lg">
              感謝の気持ちを記録するには、LINEでログインしてください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;