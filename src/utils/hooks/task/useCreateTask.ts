import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTaskSchema } from '@/components/Task/schemas';
import { createTask } from '@/api/tasks';
import type { z } from 'zod';
import { useToast } from '../useToast';
import type { TaskInterface } from '@/types/entities';
import { useTranslation } from 'react-i18next';

type QueryResult = { data: { data: TaskInterface[] } };

export const useCreateTask = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateTaskSchema>) => createTask(data),

    onMutate: async (newTask) => {
      const queryKey = [`tasks-${newTask.teamId}`];
      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousTasks = queryClient.getQueryData<QueryResult>(queryKey);

      const tempTask: TaskInterface = {
        id: `temp-id-${Date.now()}`,
        type: 'tasks',
        attributes: {
          id: `temp-id-${Date.now()}`,
          title: newTask.title,
          description: newTask.description,
          listId: newTask.listId,
          teamId: newTask.teamId,
          assigneeId: '',
          dueAt: '',
          position: 0,
          isCompleted: false,
        },
      };

      queryClient.setQueryData<QueryResult>(queryKey, (old) => {
        if (!old) return { data: { data: [tempTask] } };
        return {
          ...old,
          data: {
            ...old.data,
            data: [tempTask, ...old.data.data],
          },
        };
      });

      return { previousTasks };
    },

    onSuccess: (savedTask, newTask) => {
      const queryKey = [`tasks-${newTask.teamId}`];
      queryClient.setQueryData<QueryResult>(queryKey, (old) => {
        if (!old) return { data: { data: [savedTask] } };
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((task) => (task.id === `temp-id-${Date.now()}` ? savedTask : task)),
          },
        };
      });

      toast.success(t('task created successfully'));
    },

    onError: (_error, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData([`tasks-${newTask.teamId}`], context.previousTasks);
      }
      toast.error(t('error creating task'));
    },

    onSettled: (_, __, newTask) => {
      queryClient.invalidateQueries({ queryKey: [`tasks-${newTask.teamId}`] });
    },
  });
};
