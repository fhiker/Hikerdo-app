import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import type { z } from 'zod';
import type { teamMemberRespondSchema } from '@/components/Teams/schemas';
import { useTranslation } from 'react-i18next';
import { memberRespond } from '@/api/team-members';

export const useTeamMemberRespond = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { memberId: string; data: z.infer<typeof teamMemberRespondSchema> }) => memberRespond(data),

    onSuccess: () => {
      toast.success(t('user invited successfully'));
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },

    onError: (err, user, context) => {
      toast.error(t('error inviting user'));
    },
  });
};
