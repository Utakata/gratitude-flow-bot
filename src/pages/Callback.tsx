import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const error_description = params.get('error_description');

        // Check for errors from LINE platform
        if (error) {
          console.error('LINE Login Error:', error, error_description);
          throw new Error(error_description || "認証に失敗しました");
        }

        // Verify state to prevent CSRF attacks
        const savedState = localStorage.getItem('line_state');
        if (!state || state !== savedState) {
          throw new Error("不正なリクエストです");
        }

        if (!code) {
          throw new Error("認証コードがありません");
        }

        // Exchange authorization code for access token
        const response = await fetch('/api/line/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code,
            redirectUri: window.location.origin + '/callback'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "トークンの取得に失敗しました");
        }

        const data = await response.json();
        console.log('Token exchange successful');

        // Store user data
        if (data.user) {
          localStorage.setItem('line_user', JSON.stringify(data.user));
          
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
        }

        // Clean up state
        localStorage.removeItem('line_state');
        
        // Redirect to home
        navigate('/');
      } catch (error: any) {
        console.error('Error during LINE callback:', error);
        toast({
          variant: "destructive",
          title: "ログインエラー",
          description: error.message || "認証処理中にエラーが発生しました",
        });
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white flex items-center justify-center">
      <div className="text-gratitude-900">認証処理中...</div>
    </div>
  );
};

export default Callback;