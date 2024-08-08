import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import type { TaskInterface } from '@/types/entities';
import { deleteTask } from '@/api/tasks';
import { useTranslation } from 'react-i18next';

export const useDeleteTask = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ task }: { task: TaskInterface; teamId: string }) => deleteTask(task),

    onMutate: async ({ task, teamId }: { task: TaskInterface; teamId: string }) => {
      await queryClient.cancelQueries({ queryKey: [`tasks-${teamId}`] });

      const previousTasksResponse = queryClient.getQueryData<{ data: { data: TaskInterface[] } }>([`tasks-${teamId}`]);
      const previousTasks = previousTasksResponse?.data?.data || [];

      queryClient.setQueryData<{ data: { data: TaskInterface[] } }>([`tasks-${teamId}`], (old) => {
        if (!old) return { data: { data: [] } };
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((t) => t.id !== task.id),
          },
        };
      });

      return { previousTasks };
    },

    onSuccess: (_, { teamId }) => {
      toast.success(t('task deleted successfully'));
      queryClient.invalidateQueries({ queryKey: [`tasks-${teamId}`] });
    },

    onError: (_error, { task, teamId }, context) => {
      toast.error(`${t('error deleting task')} ${task.attributes.title}`);
      if (context?.previousTasks) {
        queryClient.setQueryData<{ data: { data: TaskInterface[] } }>([`tasks-${teamId}`], (old) => ({
          ...old,
          data: {
            ...old?.data,
            data: context.previousTasks,
          },
        }));
      }
    },

    onSettled: (_, __, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: [`tasks-${teamId}`] });
    },
  });
};
