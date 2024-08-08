import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TaskListInterface } from '@/types/entities';
import { updateTasklist } from '@/api/tasklist';
import { useToast } from '../useToast';
import type { UpdateTasklistSchema } from '@/components/Task/schemas';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';

type UpdateTasklistData = {
  tasklistId: string;
  data: z.infer<typeof UpdateTasklistSchema>;
  projectId: string;
};

type QueryData = {
  data: {
    data: TaskListInterface[];
  };
};

type MutationContext = {
  previousTasklists: QueryData | undefined;
  projectId: string;
};

export const useUpdateTasklist = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation<TaskListInterface, Error, UpdateTasklistData, MutationContext>({
    mutationFn: ({ tasklistId, data }) => updateTasklist(tasklistId, data),

    onMutate: async (updateData) => {
      await queryClient.cancelQueries({ queryKey: [`task-list-${updateData.projectId}`] });
      const previousTasklists = queryClient.getQueryData<QueryData>([`task-list-${updateData.projectId}`]);

      queryClient.setQueryData<QueryData | undefined>([`task-list-${updateData.projectId}`], (old) => {
        if (!old || !old.data || !Array.isArray(old.data.data)) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((tasklist) =>
              tasklist.id === updateData.tasklistId
                ? {
                    ...tasklist,
                    attributes: {
                      ...tasklist.attributes,
                      ...updateData.data,
                    },
                  }
                : tasklist,
            ),
          },
        };
      });

      return { previousTasklists, projectId: updateData.projectId };
    },

    onSuccess: (_, { projectId, tasklistId }) => {
      queryClient.invalidateQueries({ queryKey: [`task-list-${projectId}`] });
      toast.success(t('tasklist updated successfully'));
      return tasklistId;
    },

    onError: (error, _, context) => {
      if (context?.previousTasklists) {
        queryClient.setQueryData([`task-list-${context.projectId}`], context.previousTasklists);
      }
      toast.error(t('error updating tasklist'));
      console.error(error);
    },

    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: [`task-list-${projectId}`] });
    },
  });
};
