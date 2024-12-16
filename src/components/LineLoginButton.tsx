import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const LineLoginButton = () => {
  const handleLineLogin = () => {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('line_state', state);

    // Get the current origin for the redirect_uri
    const redirectUri = 'https://preview--gratitude-flow-bot.lovable.app/callback';
    
    // Debug logs to verify the redirect URI
    console.log('Using hardcoded redirect URI:', redirectUri);

    // Construct LINE login URL with required parameters
    const lineLoginUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
    lineLoginUrl.searchParams.append('response_type', 'code');
    lineLoginUrl.searchParams.append('client_id', '2003632166');
    lineLoginUrl.searchParams.append('redirect_uri', redirectUri);
    lineLoginUrl.searchParams.append('state', state);
    lineLoginUrl.searchParams.append('scope', 'profile openid');
    lineLoginUrl.searchParams.append('nonce', Math.random().toString(36).substring(7));

    // Log the final URL for debugging
    console.log('Final LINE Login URL:', lineLoginUrl.toString());
    console.log('Redirect URI from URL object:', lineLoginUrl.searchParams.get('redirect_uri'));

    // Redirect to LINE login
    window.location.href = lineLoginUrl.toString();
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