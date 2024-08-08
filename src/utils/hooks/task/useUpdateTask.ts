import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TaskInterface } from '@/types/entities';
import { updateTask } from '@/api/tasks';
import { useToast } from '../useToast';
import type { UpdateTaskSchema } from '@/components/Task/schemas';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';

export const useUpdateTask = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      task,
      data,
    }: {
      task: TaskInterface;
      data: z.infer<typeof UpdateTaskSchema>;
      teamId: string;
    }) => updateTask(task, data),

    onMutate: async ({ task, data, teamId }) => {
      await queryClient.cancelQueries({ queryKey: [`tasks-${teamId}`] });

      const previousTasks = queryClient.getQueryData<{ data: { data: TaskInterface[] } }>([`tasks-${teamId}`]);

      if (previousTasks) {
        let updatedTasks = [...previousTasks.data.data];

        const oldPosition = task.attributes.position;
        const oldListId = task.attributes.listId;
        const newPosition = data.position !== undefined ? data.position : oldPosition;
        const newListId = data.listId !== undefined ? data.listId : oldListId;

        updatedTasks = updatedTasks.map((t) => {
          if (t.id === task.id) {
            // Update the task being moved
            return { ...t, attributes: { ...t.attributes, ...data, position: newPosition, listId: newListId } };
          }
          if (oldListId !== newListId) {
            // Task is moving to a new list
            if (t.attributes.listId === oldListId && t.attributes.position > oldPosition) {
              // Decrement positions in the old list
              return { ...t, attributes: { ...t.attributes, position: t.attributes.position - 1 } };
            }
            if (t.attributes.listId === newListId && t.attributes.position >= newPosition) {
              // Increment positions in the new list
              return { ...t, attributes: { ...t.attributes, position: t.attributes.position + 1 } };
            }
          } else if (data.position !== undefined) {
            // Task is moving within the same list
            if (oldPosition < newPosition) {
              // Moving task down
              if (t.attributes.position > oldPosition && t.attributes.position <= newPosition) {
                return { ...t, attributes: { ...t.attributes, position: t.attributes.position - 1 } };
              }
            } else if (oldPosition > newPosition) {
              // Moving task up
              if (t.attributes.position >= newPosition && t.attributes.position < oldPosition) {
                return { ...t, attributes: { ...t.attributes, position: t.attributes.position + 1 } };
              }
            }
          }
          return t;
        });

        queryClient.setQueryData<{ data: { data: TaskInterface[] } }>([`tasks-${teamId}`], {
          data: { data: updatedTasks },
        });
      }

      return { previousTasks };
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: [`tasks-${teamId}`] });
      toast.success(t('task updated successfully'));
    },

    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          [`tasks-${context.previousTasks.data.data[0].attributes.teamId}`],
          context.previousTasks,
        );
      }
      toast.error(t('error updating task'));
    },

    onSettled: (_, __, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: [`tasks-${teamId}`] });
    },
  });
};
