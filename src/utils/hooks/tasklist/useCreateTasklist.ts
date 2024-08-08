import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../useToast';
import type { TaskListInterface } from '@/types/entities';
import { createTasklist } from '@/api/tasklist';
import { CreateTasklistSchema } from '@/components/Task/schemas';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';

CreateTasklistSchema;

export const useCreateTaskList = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof CreateTasklistSchema>) => createTasklist(data),

    onMutate: async (newTasklist: z.infer<typeof CreateTasklistSchema>) => {
      await queryClient.cancelQueries({ queryKey: [`task-list-${newTasklist.projectId}`] });

      const result = queryClient.getQueryData<{ data: { data: TaskListInterface[] } }>([
        `task-list-${newTasklist.projectId}`,
      ]);
      const previousTasklists = result?.data.data || [];

      const optimisticTasklist: TaskListInterface = {
        id: '123456789',
        type: 'task-lists',
        attributes: {
          id: '123456789',
          title: newTasklist.title,
          position: previousTasklists.length,
          teamId: '',
          projectId: newTasklist.projectId,
          ownerId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        links: {
          self: '',
        },
      };

      queryClient.setQueryData<{ data: { data: TaskListInterface[] } }>(
        [`task-list-${newTasklist.projectId}`],
        (old) => ({
          data: {
            data: [...(old?.data.data || []), optimisticTasklist],
          },
        }),
      );

      return { previousTasklists };
    },

    onSuccess: (savedTasklist, newTasklist) => {
      queryClient.setQueryData<{ data: { data: TaskListInterface[] } }>(
        [`task-list-${newTasklist.projectId}`],
        (old) => ({
          data: {
            data: (old?.data.data || []).map((tasklist) => (tasklist.id === 'temp-id' ? savedTasklist : tasklist)),
          },
        }),
      );

      toast.success(t('tasklist created successfully'));
      queryClient.invalidateQueries({ queryKey: [`task-list-${newTasklist.projectId}`] });
    },

    onError: (_error, newTasklist, context) => {
      toast.error(t('error creating tasklist'));

      if (context?.previousTasklists) {
        queryClient.setQueryData<{ data: { data: TaskListInterface[] } }>([`task-list-${newTasklist.projectId}`], {
          data: { data: context.previousTasklists },
        });
      }
    },
  });
};
