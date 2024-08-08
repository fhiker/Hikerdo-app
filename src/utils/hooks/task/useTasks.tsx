import axiosInstance from "@/api/api-client";
import type { TaskInterface } from "@/types/entities";
import type { statusType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

type UseTasksReturnType = {
    tasks: { data: TaskInterface[] } | undefined,
    tasksStatus: statusType
}

export const useTasks = (teamId: string | undefined): UseTasksReturnType => {
    const { data, status } = useQuery({
        queryKey: [`tasks-${teamId}`],
        queryFn: () => {
            return axiosInstance.get('/tasks', {
                params: {
                    teamId: teamId,
                    include: 'assignee'
                }
            })
        },
        enabled: !!teamId,
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    })
    return { tasks: data?.data, tasksStatus: status }
}
