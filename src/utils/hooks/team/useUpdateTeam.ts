import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TeamInterface } from '@/types/entities';
import { useToast } from '../useToast';
import { ZodError, type z } from 'zod';
import type { UpdateTeamSchema } from '@/components/Teams/schemas';
import { updateTeam } from '@/api/teams';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

interface TeamsQueryData {
  data: {
    data: TeamInterface[];
  };
}

export const useUpdateTeam = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: {
      teamId: string;
      data: Record<keyof z.infer<typeof UpdateTeamSchema>, string>;
    }) => updateTeam(data.teamId, data.data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });

      const previousTeams = queryClient.getQueryData<TeamsQueryData>(['teams']);

      if (previousTeams?.data?.data) {
        queryClient.setQueryData<TeamsQueryData>(['teams'], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((team) =>
                team.id === data.teamId
                  ? {
                      ...team,
                      attributes: { ...team.attributes, ...data.data },
                    }
                  : team,
              ),
            },
          };
        });
      }

      return { previousTeams };
    },
    onSuccess: () => {
      toast.success(t('team updated successfully'));
    },

    onError: (err, newTeam, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData<TeamsQueryData>(['teams'], context.previousTeams);
      }
      if (err instanceof ZodError) {
        toast.error(t('Please check your input and try again!'));
      } else if (err instanceof AxiosError) {
        toast.error(t('Saving changes to the server failed!'));
      } else {
        toast.error(t('error updating team'));
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
