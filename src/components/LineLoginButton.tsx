import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const LineLoginButton = () => {
  const handleLineLogin = () => {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('line_state', state);

    // Construct LINE login URL with required parameters
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: '2003632166',
      redirect_uri: window.location.origin,
      state: state,
      scope: 'profile openid',
      nonce: Math.random().toString(36).substring(7),
    });

    // Redirect to LINE login
    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
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