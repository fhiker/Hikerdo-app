import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTasklistSchema } from '@/components/Task/schemas';
import type { TaskListInterface } from '@/types/entities';
import { updateTasklist } from '@/api/tasklist';
import { useToast } from '../useToast';
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

      if (previousTasklists) {
        let updatedTaskLists = [...previousTasklists.data.data];
        const currentTaskList = updatedTaskLists.find((list) => list.id === updateData.tasklistId);
        const oldPosition = currentTaskList?.attributes.position;
        const newPosition = updateData.data.position !== undefined ? updateData.data.position : oldPosition;

        if (oldPosition === undefined || newPosition === undefined) {
          console.error('Old or new position is undefined');
          return;
        }

        updatedTaskLists = updatedTaskLists.map((list) => {
          // Update the task list being moved
          if (list.id === updateData.tasklistId) {
            return {
              ...list,
              attributes: {
                ...list.attributes,
                ...updateData.data,
                position: newPosition,
              },
            };
          }

          // Adjust positions for other task lists
          if (list.attributes.position !== undefined) {
            if (oldPosition < newPosition) {
              // Moving list right
              if (list.attributes.position > oldPosition && list.attributes.position <= newPosition) {
                return {
                  ...list,
                  attributes: {
                    ...list.attributes,
                    position: list.attributes.position - 1,
                  },
                };
              }
            } else if (oldPosition > newPosition) {
              // Moving list left
              if (list.attributes.position >= newPosition && list.attributes.position < oldPosition) {
                return {
                  ...list,
                  attributes: {
                    ...list.attributes,
                    position: list.attributes.position + 1,
                  },
                };
              }
            }
          }

          return list;
        });
        queryClient.setQueryData<{ data: { data: TaskListInterface[] } }>([`task-list-${updateData.projectId}`], {
          data: { data: updatedTaskLists },
        });
      }

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
