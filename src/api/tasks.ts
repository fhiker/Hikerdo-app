import axiosInstance from './api-client';
import { CreateTaskSchema, UpdateTaskSchema } from '@/components/Task/schemas';
import type { z } from 'zod';
import type { TaskInterface } from '@/types/entities';

async function createTask(data: z.infer<typeof CreateTaskSchema>): Promise<TaskInterface> {
  try {
    const validatedData = CreateTaskSchema.parse(data);
    return axiosInstance.post('tasks', validatedData).then((res) => res.data);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}
async function updateTask(updatingTask: TaskInterface, data: z.infer<typeof UpdateTaskSchema>): Promise<string> {
  try {
    const validatedData = UpdateTaskSchema.parse(data);
    return axiosInstance.patch(`tasks/${updatingTask.id}`, validatedData).then((res) => res.data);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

async function deleteTask(taskToDelete: TaskInterface): Promise<string> {
  return axiosInstance.delete(`/tasks/${taskToDelete.id}`);
}

export { createTask, updateTask, deleteTask };
