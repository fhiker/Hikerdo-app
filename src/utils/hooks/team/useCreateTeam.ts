import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import { useToast } from '../useToast';
import { createTeam } from '@/api/teams';
import type { CreateTeamSchema } from '@/components/Teams/schemas';
import { useTranslation } from 'react-i18next';

type Team = {
  id: string;
  attributes: {
    title: string;
  };
};

type TeamsQueryResult = {
  data: {
    data: Team[];
  };
};

export const useCreateTeam = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateTeamSchema>) => createTeam(data),

    onMutate: async (newTeam) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<TeamsQueryResult>(['teams']);

      queryClient.setQueryData<TeamsQueryResult>(['teams'], (oldData) => {
        if (!oldData) return { data: { data: [] } };
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: [{ id: 'temp-id', attributes: { title: newTeam.title } }, ...oldData.data.data],
          },
        };
      });

      return { previousTeams };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<TeamsQueryResult>(['teams'], (oldData) => {
        if (!oldData) return { data: { data: [data] } };
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((team) => (team.id === 'temp-id' ? data : team)),
          },
        };
      });

      toast.success(t('team created successfully'));
    },

    onError: (error, newTeam, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      toast.error(t('error deleting team'));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
