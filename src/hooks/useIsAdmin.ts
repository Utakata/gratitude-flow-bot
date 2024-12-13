import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useIsAdmin = (userId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking admin status for user:', userId);
        const { data, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "エラー",
            description: "管理者権限の確認中にエラーが発生しました。",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        setIsAdmin(!!data);
        console.log('Admin status:', !!data);
      } catch (error) {
        console.error('Error in admin check:', error);
        toast({
          title: "エラー",
          description: "管理者権限の確認中にエラーが発生しました。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [userId, toast]);

  return { isAdmin, isLoading };
};