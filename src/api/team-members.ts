import { CreateTeamMemberSchema, teamMemberRespondSchema } from '@/components/Teams/schemas';
import type { z } from 'zod';
import axiosInstance from './api-client';

async function inviteMember(data: z.infer<typeof CreateTeamMemberSchema>) {
  try {
    const validatedData = CreateTeamMemberSchema.parse(data);
    const response = await axiosInstance.post('/team-members', validatedData);
    return response.data.data;
  } catch (error) {
    console.error('Error inviting member:', error);
    throw error;
  }
}

async function memberRespond(data: { memberId: string; data: z.infer<typeof teamMemberRespondSchema> }) {
  try {
    const validatedData = teamMemberRespondSchema.parse(data.data);
    const response = await axiosInstance.patch(`/team-members/${data.memberId}`, validatedData);
    return response.data.data;
  } catch (error) {
    console.error('Error responding from member:', error);
    throw error;
  }
}

function deleteTeamMember(memberId: string) {
  const response = axiosInstance.delete(`/team-members/${memberId}`);
  return response;
}

export { inviteMember, memberRespond, deleteTeamMember };
