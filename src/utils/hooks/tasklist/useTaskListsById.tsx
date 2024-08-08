import axiosInstance from "@/api/api-client";
import type { TaskListInterface } from "@/types/entities";
import type { statusType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

type UseTaskListReturnType = {
    taskLists: TaskListInterface[] | undefined,
    taskListsStatus: statusType
}

export const useTaskLists = (projectId: string | undefined, fields?: string): UseTaskListReturnType => {
    const { data, status } = useQuery({
        queryKey: [`task-list-${projectId}`],
        queryFn:
            async () => {
                return axiosInstance.get("/task-lists", {
                    params: {
                        projectId: projectId,
                        fields: fields
                    }
                })
            },
        enabled: !!projectId,
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    })
    return { taskLists: data?.data.data, taskListsStatus: status }
}