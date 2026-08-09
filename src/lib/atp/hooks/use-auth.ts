import { useAtpStore } from '../store';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export function useAuth() {
  const { startAuth, logout, isAuthenticated } = useAtpStore();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const loginMutation = useMutation({
    mutationFn: async (identifier: string) => {
      try {
        await startAuth(identifier);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to login');
        throw error;
      }
    },
  });

  return {
    login: loginMutation.mutate,
    logout: () => {
      logout();
      toast.success('Successfully logged out');
      navigate({ to: searchParams.get('redirect') || '/' });
    },
    isAuthenticated,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
