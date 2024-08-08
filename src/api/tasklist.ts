import axiosInstance from './api-client';
import { CreateTasklistSchema, UpdateTasklistSchema } from '@/components/Task/schemas';
import type { z } from 'zod';
import type { TaskListInterface } from '@/types/entities';

async function createTasklist(data: z.infer<typeof CreateTasklistSchema>): Promise<TaskListInterface> {
  try {
    const validatedData = CreateTasklistSchema.parse(data);
    const response = await axiosInstance.post<TaskListInterface>('/task-lists', validatedData);
    return response.data;
  } catch (error) {
    console.error('Error crating tasklist:', error);
    throw error;
  }
}

async function updateTasklist(
  updatingTasklistId: string,
  data: z.infer<typeof UpdateTasklistSchema>,
): Promise<TaskListInterface> {
  try {
    const validatedData = UpdateTasklistSchema.parse(data);
    const response = await axiosInstance.patch<TaskListInterface>(`/task-lists/${updatingTasklistId}`, validatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating tasklist:', error);
    throw error;
  }
}

async function deleteTasklist(tasklistToDeleteId: string): Promise<void> {
  await axiosInstance.delete(`/task-lists/${tasklistToDeleteId}`);
}

export { createTasklist, updateTasklist, deleteTasklist };
