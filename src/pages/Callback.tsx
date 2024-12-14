import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const error_description = params.get('error_description');

      // Check for errors
      if (error) {
        console.error('LINE Login Error:', error, error_description);
        toast({
          variant: "destructive",
          title: "ログインエラー",
          description: error_description || "ログインに失敗しました",
        });
        navigate('/');
        return;
      }

      // Verify state to prevent CSRF attacks
      const savedState = localStorage.getItem('line_state');
      if (state !== savedState) {
        console.error('State mismatch:', { state, savedState });
        toast({
          variant: "destructive",
          title: "セキュリティエラー",
          description: "不正なリクエストです。もう一度ログインしてください。",
        });
        navigate('/');
        return;
      }

      if (code) {
        try {
          // Exchange code for tokens
          const response = await fetch('/api/line/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              code, 
              redirectUri: `${window.location.origin}/callback`
            }),
          });

          if (!response.ok) {
            throw new Error('認証に失敗しました');
          }

          const data = await response.json();
          
          // Store user data
          localStorage.setItem('line_user', JSON.stringify(data.user));
          localStorage.removeItem('line_state');

          toast({
            title: "ログインしました",
            description: `ようこそ、${data.user.displayName}さん`,
          });

          // Redirect to home page
          navigate('/');
        } catch (error: any) {
          console.error('Error during LINE callback:', error);
          toast({
            variant: "destructive",
            title: "ログインエラー",
            description: error.message,
          });
          navigate('/');
        }
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