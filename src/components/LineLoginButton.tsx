import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LineLoginButton = () => {
  const { toast } = useToast();

  const handleLineLogin = () => {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('line_state', state);

    // Hardcode the exact redirect URI that's registered in LINE Developers console
    const redirectUri = 'https://preview--gratitude-flow-bot.lovable.app/callback';
    
    // Debug logs for troubleshooting
    console.log('Starting LINE login process...');
    console.log('Using redirect URI:', redirectUri);

    try {
      // Construct LINE login URL with required parameters
      const lineLoginUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
      lineLoginUrl.searchParams.append('response_type', 'code');
      lineLoginUrl.searchParams.append('client_id', '2003632166');
      lineLoginUrl.searchParams.append('redirect_uri', encodeURIComponent(redirectUri));
      lineLoginUrl.searchParams.append('state', state);
      lineLoginUrl.searchParams.append('scope', 'profile openid');
      lineLoginUrl.searchParams.append('bot_prompt', 'normal');

      // Log constructed URL and parameters for debugging
      console.log('LINE Login URL Parameters:');
      console.log('- client_id:', lineLoginUrl.searchParams.get('client_id'));
      console.log('- redirect_uri:', decodeURIComponent(lineLoginUrl.searchParams.get('redirect_uri') || ''));
      console.log('- scope:', lineLoginUrl.searchParams.get('scope'));
      console.log('- state:', lineLoginUrl.searchParams.get('state'));
      console.log('Final LINE Login URL:', lineLoginUrl.toString());

      // Redirect to LINE login
      window.location.href = lineLoginUrl.toString();
    } catch (error) {
      console.error('Error constructing LINE login URL:', error);
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