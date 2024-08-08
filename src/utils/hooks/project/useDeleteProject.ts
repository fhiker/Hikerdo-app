import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import { deleteProject } from '@/api/projects';
import type { ProjectInterface } from '@/types/entities';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface QueryData {
  data: {
    data: ProjectInterface[];
  };
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { projectId: string; teamId: string }) => deleteProject(data.projectId),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [`projects-${data.teamId}`] });

      const previousProjects = queryClient.getQueryData<QueryData>([`projects-${data.teamId}`]);

      queryClient.setQueryData<QueryData>([`projects-${data.teamId}`], (old) => {
        if (!old) return { data: { data: [] } };
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((project) => project.id !== data.projectId),
          },
        };
      });

      return { previousProjects };
    },

    onSuccess: (_, data) => {
      navigate('/');
      toast.success(t('project deleted successfully'));
      queryClient.invalidateQueries({ queryKey: [`projects-${data.teamId}`] });
    },

    onError: (error, data, context) => {
      //@ts-ignore
      const errorResponse = error.response?.data;
      const errorDetails = errorResponse?.errors[0];

      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let errorMessage;
      if (errorDetails?.meta?.error_code) {
        errorMessage = t(errorDetails.meta.error_code);
      } else {
        errorMessage = errorDetails?.title || 'Unknown error';
      }

      const toastMessage = `${t('error deleting project')} ${errorMessage}`;
      toast.error(toastMessage);

      if (context?.previousProjects) {
        queryClient.setQueryData([`projects-${data.teamId}`], context.previousProjects);
      }
    },

    onSettled: (_, __, data) => {
      queryClient.invalidateQueries({ queryKey: [`projects-${data.teamId}`] });
    },
  });
};
