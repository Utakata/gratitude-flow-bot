import { useEffect, useState } from "react";
import { GratitudeForm } from "@/components/GratitudeForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "line",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "ログインエラー",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "ログアウトしました",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "ログアウトエラー",
        description: error.message,
      });
    }
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