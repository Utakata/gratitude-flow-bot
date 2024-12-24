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
        if (window.liff.isLoggedIn()) {
          const profile = await window.liff.getProfile();
          console.log("User profile retrieved:", profile);
          
          sessionStorage.setItem('line_user', JSON.stringify(profile));
          
          await supabase.from('line_settings').upsert({
            user_id: profile.userId,
            line_user_id: profile.userId,
            is_messaging_enabled: true,
            updated_at: new Date().toISOString(),
          });

          toast({
            title: "ログインしました",
            description: `ようこそ、${profile.displayName}さん`,
          });
          
          navigate('/gratitude', { replace: true });
        } else {
          throw new Error("ログインに失敗しました");
        }
      } catch (error: any) {
        console.error('Error during callback:', error);
        sessionStorage.removeItem('line_user');
        
        toast({
          variant: "destructive",
          title: "ログインエラー",
          description: error.message || "認証処理中にエラーが発生しました",
        });
        navigate('/', { replace: true });
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