import axiosInstance from "@/api/api-client";
import type { TeamMembersInterface } from "@/types/entities";
import type { statusType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

type UseTeamMembersReturnType = {
    teamMembersData: TeamMembersInterface[] | undefined,
    teamMembersStatus: statusType
}

export const useTeamMembers = (teamId: string | undefined, includeUsers?: 'user' | 'team'): UseTeamMembersReturnType => {
    const { data, status } = useQuery({
        queryKey: [`team-members-${teamId}`],
        queryFn: async () => {
            return axiosInstance.get("/team-members", {
                params: {
                    teamId: teamId,
                    include: includeUsers ? includeUsers : undefined
                }
            })
        },
        // enabled: !!teamId,
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    })
    return { teamMembersData: data?.data.data, teamMembersStatus: status }
}