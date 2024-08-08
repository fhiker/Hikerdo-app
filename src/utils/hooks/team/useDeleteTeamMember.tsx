import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import { useTranslation } from 'react-i18next';
import { deleteTeamMember } from '@/api/team-members';
import type { TeamMembersInterface } from '@/types/entities';

type TeamMembersQueryResult = {
    data: {
        data: TeamMembersInterface[];
    };
};

export const useDeleteTeamMember = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: { teamId?: string, memberId: string }) => deleteTeamMember(data.memberId),

        onMutate: async (data: { teamId?: string, memberId: string }) => {
            if (data.teamId) {
                await queryClient.cancelQueries({ queryKey: [`team-members-${data.teamId}`] });
                const previousTeams = queryClient.getQueryData(['teams']);

                queryClient.setQueryData<TeamMembersQueryResult>([`team-members-${data.teamId}`], (oldData) => {
                    if (!oldData) return { data: { data: [] } };
                    return {
                        ...oldData,
                        data: {
                            ...oldData.data,
                            data: oldData.data.data.filter((member) => member.id !== data.memberId),
                        },
                    };
                });
                return { previousTeams };
            }
        },

        onSuccess: (_, teamId) => {
            if (teamId) {
                toast.success(t('team member deleted successfully'));
            }
        },

        onError: (error, data, context) => {
            if (context?.previousTeams) {
                queryClient.setQueryData([`team-members-${data.teamId}`], context.previousTeams);
            }
            toast.error(`${t('error deleting team')} ${data.teamId}`);
        },

        onSettled: (teamId) => {
            queryClient.invalidateQueries({ queryKey: [`team-members-${teamId}`] });
        },
    });
};
