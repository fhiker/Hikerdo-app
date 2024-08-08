import axiosInstance from "@/api/api-client";
import type { TeamInterface } from "@/types/entities";
import type { statusType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

type UseTeamReturnType = {
    teamData: TeamInterface[] | undefined,
    teamsStatus: statusType
}

export const useTeam = (): UseTeamReturnType => {
    const { data, status } = useQuery({
        queryKey: ["teams"],
        queryFn: async () => {
            return await axiosInstance.get("/teams")
        },
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    })
    return { teamData: data?.data.data, teamsStatus: status }
}