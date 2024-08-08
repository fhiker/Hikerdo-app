import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectInterface } from '@/types/entities';
import { useToast } from '../useToast';
import type { z } from 'zod';
import { updateProject } from '@/api/projects';
import type { UpdateProjectSchema } from '@/components/Project/schemas';
import { useTranslation } from 'react-i18next';

interface ProjectsQueryData {
  data: {
    data: ProjectInterface[];
  };
}

export const useUpdateProject = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      data: z.infer<typeof UpdateProjectSchema>;
      teamId: string;
    }) => updateProject(data.projectId, data.data, data.teamId),

    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [`projects-${data.teamId}`],
      });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<ProjectsQueryData>([`projects-${data.teamId}`]);

      // Optimistically update to the new value
      if (previousProjects?.data?.data) {
        queryClient.setQueryData<ProjectsQueryData>([`projects-${data.teamId}`], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((project) =>
                project.id === data.projectId
                  ? {
                      ...project,
                      attributes: { ...project.attributes, ...data.data },
                    }
                  : project,
              ),
            },
          };
        });
      }

      // Return a context object with the snapshotted value
      return { previousProjects };
    },

    onError: (error, newProject, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData<ProjectsQueryData>([`projects-${newProject.teamId}`], context.previousProjects);
      }
      toast.error(t('error updating project'));
    },

    onSuccess: (response, variables) => {
      toast.success(t('project updated successfully'));

      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [`projects-${variables.teamId}`],
      });
    },

    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      // This is optional if you're already invalidating in onSuccess
      // queryClient.invalidateQueries([`projects-${data.teamId}`] as any);
    },
  });
};
