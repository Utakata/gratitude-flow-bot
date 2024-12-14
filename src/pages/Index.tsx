import { useEffect, useState } from "react";
import { GratitudeForm } from "@/components/GratitudeForm";
import { Button } from "@/components/ui/button";
import { LogOut, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineLoginButton } from "@/components/LineLoginButton";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check URL parameters for LINE login response
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const error_description = params.get('error_description');
    
    if (error) {
      console.error('LINE Login Error:', error, error_description);
      toast({
        variant: "destructive",
        title: "ログインエラー",
        description: error_description || "ログインに失敗しました",
      });
      return;
    }
    
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
      // Remove code from URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
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
      
      // Store user data in localStorage and Supabase
      localStorage.setItem('line_user', JSON.stringify(data.user));
      setUser(data.user);

      // Update line_settings in Supabase
      await supabase.from('line_settings').upsert({
        user_id: data.user.id,
        line_user_id: data.user.id,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        is_messaging_enabled: true,
        updated_at: new Date().toISOString(),
      });

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
              <LineLoginButton />
            )}
          </div>
        </div>

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