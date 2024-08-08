import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import { deleteTeam } from '@/api/teams';
import type { TeamInterface } from '@/types/entities';
import { useTranslation } from 'react-i18next';

type TeamsQueryResult = {
  data: {
    data: TeamInterface[];
  };
};

export const useDeleteTeam = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),

    onMutate: async (teamId: string) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<TeamsQueryResult>(['teams']);

      queryClient.setQueryData<TeamsQueryResult>(['teams'], (oldData) => {
        if (!oldData) return { data: { data: [] } };
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.filter((team) => team.id !== teamId),
          },
        };
      });

      return { previousTeams };
    },

    onSuccess: (_, _teamId) => {
      toast.success(t('team deleted successfully'));
    },

    onError: (_error, teamId, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      toast.error(`${t('error deleting team')} ${teamId}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
