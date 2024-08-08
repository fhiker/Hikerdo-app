import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import type { TaskListInterface } from '@/types/entities';
import { deleteTasklist } from '@/api/tasklist';
import { useTranslation } from 'react-i18next';

export const useDeleteTasklist = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ tasklistId }: { tasklistId: string }) => deleteTasklist(tasklistId),

    onMutate: async ({ tasklistId, projectId }: { tasklistId: string; projectId: string }) => {
      await queryClient.cancelQueries({ queryKey: [`task-list-${projectId}`] });

      const result = queryClient.getQueryData<{ data: { data: TaskListInterface[] } }>([`task-list-${projectId}`]);
      const previousTasklists = result?.data.data;
      const defaultStructure: TaskListInterface[] = [];
      const safeTasklists = previousTasklists || defaultStructure;

      queryClient.setQueryData<{ data: { data: TaskListInterface[] } }>([`task-list-${projectId}`], (old) => {
        if (!old) return { data: { data: [] } };
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((tasklist) => tasklist.id !== tasklistId),
          },
        };
      });

      return { previousTasklists: safeTasklists };
    },

    onSuccess: (_, { projectId }) => {
      toast.success(t('tasklist deleted successfully'));
      queryClient.invalidateQueries({ queryKey: [`task-list-${projectId}`] });
    },

    onError: (_, { tasklistId, projectId }, context) => {
      toast.error(`${t('error deleting tasklist')} ${tasklistId}`);
      console.log(context);
      if (context?.previousTasklists) {
        queryClient.setQueryData<TaskListInterface[]>([`task-list-${projectId}`], context.previousTasklists);
      }
    },
  });
};
