import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const LineLoginButton = () => {
  const handleLineLogin = () => {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('line_state', state);

    // Get the current origin for the redirect_uri
    // Use window.location.origin to get the base URL without trailing slash
    const redirectUri = `${window.location.origin}/callback`;
    
    // Debug logs to verify the redirect URI
    console.log('Current origin:', window.location.origin);
    console.log('Full redirect URI:', redirectUri);

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