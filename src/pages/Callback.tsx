import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!window.liff.isLoggedIn()) {
          console.error('User is not logged in');
          toast({
            variant: "destructive",
            title: "エラー",
            description: "ログインに失敗しました。",
          });
          navigate('/');
          return;
        }

        // Get user profile
        const profile = await window.liff.getProfile();
        console.log('User profile:', profile);

        // Store user data
        localStorage.setItem('line_user', JSON.stringify(profile));

        toast({
          title: "ログインしました",
          description: `ようこそ、${profile.displayName}さん`,
        });

        // Redirect to home page
        navigate('/');
      } catch (error: any) {
        console.error('Error during LINE callback:', error);
        toast({
          variant: "destructive",
          title: "ログインエラー",
          description: error.message || "認証に失敗しました",
        });
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gratitude-50 to-white flex items-center justify-center">
      <div className="text-gratitude-900">認証中...</div>
    </div>
  );
};

export default Callback;