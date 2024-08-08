import { CreateProjectSchema, UpdateProjectSchema } from '@/components/Project/schemas';
import axiosInstance from './api-client';
import type { z } from 'zod';
import type { ProjectInterface } from '@/types/entities';

async function createProject(data: z.infer<typeof CreateProjectSchema>) {
  try {
    const validatedData = CreateProjectSchema.parse(data);
    const response = await axiosInstance.post('/projects', validatedData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

async function updateProject(
  projectId: string,
  data: z.infer<typeof UpdateProjectSchema>,
  teamId: string,
): Promise<{ data: ProjectInterface; teamId: string }> {
  const validatedData = UpdateProjectSchema.parse(data);
  try {
    const response = await axiosInstance.patch(`/projects/${projectId}`, validatedData);
    console.log(response.data);
    return { data: response.data, teamId };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

async function deleteProject(projectIdToDelete: string): Promise<string> {
  const response = await axiosInstance.delete(`/projects/${projectIdToDelete}`);
  return response.data;
}

export { createProject, updateProject, deleteProject };
