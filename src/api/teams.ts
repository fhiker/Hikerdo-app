import { CreateTeamSchema, UpdateTeamSchema } from '@/components/Teams/schemas';
import type { z } from 'zod';
import axiosInstance from './api-client';
import type { TeamInterface } from '@/types/entities';

type CreateTeamData = z.infer<typeof CreateTeamSchema>;
type UpdateTeamData = z.infer<typeof UpdateTeamSchema>;

async function createTeam(data: CreateTeamData): Promise<TeamInterface> {
  try {
    const validatedData = CreateTeamSchema.parse(data);
    const response = await axiosInstance.post('/teams', validatedData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

async function updateTeam(teamId: string, data: UpdateTeamData): Promise<TeamInterface> {
  try {
    const validatedData = UpdateTeamSchema.parse(data);
    const response = await axiosInstance.patch(`/teams/${teamId}`, validatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
}

async function deleteTeam(teamId: string): Promise<string> {
  const response = await axiosInstance.delete(`/teams/${teamId}`);
  return response.data;
}

export { createTeam, updateTeam, deleteTeam };
