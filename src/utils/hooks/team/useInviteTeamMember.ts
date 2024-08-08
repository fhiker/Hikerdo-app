import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import type { z } from 'zod';
import type { CreateTeamMemberSchema } from '@/components/Teams/schemas';
import { useTranslation } from 'react-i18next';
import { inviteMember } from '@/api/team-members';

export const useInviteTeamMember = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateTeamMemberSchema>) => inviteMember(data),

    onSuccess: () => {
      toast.success(t('user invited successfully'));
    },

    onError: (_err, _user, _context) => {
      toast.error(t('error inviting user'));
    },

    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: [`team-members-${data.teamId}`] });
    },
  });
};
