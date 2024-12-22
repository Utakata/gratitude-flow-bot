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
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const error_description = params.get('error_description');

        console.log('Callback received - State:', state);
        console.log('Callback received - Code:', code ? 'Present' : 'Missing');
        console.log('Callback received - Error:', error);

        if (error) {
          console.error('LINE Login Error:', error, error_description);
          throw new Error(error_description || "認証に失敗しました");
        }

        const savedState = sessionStorage.getItem('line_login_state');
        console.log('Saved state:', savedState);
        
        if (!state || state !== savedState) {
          console.error('State mismatch - Received:', state, 'Saved:', savedState);
          throw new Error("不正なリクエストです");
        }

        if (!code) {
          throw new Error("認証コードがありません");
        }

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

        if (data.user) {
          sessionStorage.setItem('line_user', JSON.stringify(data.user));
          
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

        sessionStorage.removeItem('line_login_state');
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