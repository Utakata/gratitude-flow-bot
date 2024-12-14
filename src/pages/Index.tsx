import { useEffect, useState } from "react";
import { GratitudeForm } from "@/components/GratitudeForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CHANNEL_ID = "YOUR_LINE_CHANNEL_ID"; // You'll need to replace this with your LINE Channel ID
const REDIRECT_URI = encodeURIComponent(window.location.origin);

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check URL parameters for LINE login response
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code) {
      handleLineCallback(code);
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
  }, []);

  const handleLineCallback = async (code: string) => {
    try {
      // Here you would typically exchange the code for an access token
      // and get user profile information using LINE's API
      // For now, we'll simulate this with a mock user
      const mockUser = {
        id: 'mock_id',
        displayName: 'LINE User',
      };

      localStorage.setItem('line_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Remove code from URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
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