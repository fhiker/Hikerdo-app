import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import { createProject } from '@/api/projects';
import type { CreateProjectSchema } from '@/components/Project/schemas';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';

interface ProjectsQueryData {
  data: {
    data: Array<{
      id: string;
      attributes: z.infer<typeof CreateProjectSchema>;
    }>;
  };
}

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateProjectSchema>) => createProject(data),

    onMutate: async (newProjectData) => {
      await queryClient.cancelQueries({
        queryKey: [`projects-${newProjectData.teamId}`],
      });

      const previousProjects = queryClient.getQueryData<ProjectsQueryData>([`projects-${newProjectData.teamId}`]);

      if (previousProjects) {
        const optimisticProject = {
          id: `temp-id-${Date.now()}`, // temporary ID
          attributes: newProjectData,
        };

        queryClient.setQueryData<ProjectsQueryData>([`projects-${newProjectData.teamId}`], (old) => {
          if (!old) return { data: { data: [optimisticProject] } };
          return {
            ...old,
            data: {
              ...old.data,
              data: [...old.data.data, optimisticProject],
            },
          };
        });
      }

      return { previousProjects };
    },

    onSuccess: (response, newProject) => {
      queryClient.setQueryData<ProjectsQueryData>([`projects-${newProject.teamId}`], (old) => {
        if (!old) return old;
        const updatedProjects = old.data.data.map((project) =>
          project.id.startsWith('temp-id-') ? { id: response.data.id, attributes: response.data.attributes } : project,
        );
        return {
          ...old,
          data: {
            ...old.data,
            data: updatedProjects,
          },
        };
      });

      toast.success(t('project created successfully'));
    },

    onError: (error, newProject, context) => {
      // Rollback to the previous state
      if (context?.previousProjects) {
        queryClient.setQueryData<ProjectsQueryData>([`projects-${newProject.teamId}`], context.previousProjects);
      }
      toast.error(t('error creating project'));
    },

    onSettled: (data, error, variables) => {
      // Refetch to ensure our local data is in sync with the server
      queryClient.invalidateQueries({
        queryKey: [`projects-${variables.teamId}`],
      });
    },
  });
};
