import { useQuery } from "@tanstack/react-query";
import textToColor from "../../functions/textToColor";
import type { ProjectInterface } from "@/types/entities";
import type { statusType } from "@/types/types";
import axiosInstance from "@/api/api-client";

type UseProjectReturnType = {
    projectsData: ProjectInterface[] | undefined,
    projectsStatus: statusType
}

export const useProjects = (teamId: string | undefined): UseProjectReturnType => {
    const { data, status } = useQuery({
        queryKey: [teamId ? `projects-${teamId}` : 'projects'],
        queryFn: async () => {
            return axiosInstance.get("/projects", {
                params: { teamId }
            })
        },
        select: (data) => {
            return data.data.data.map((project: ProjectInterface) => {
                project.attributes.iconColor = textToColor(project.attributes.title);
                return project;
            })
        },
        enabled: !!teamId,
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    })

    return { projectsData: data, projectsStatus: status }
}