import * as zod from 'zod';

export const CreateTeamMemberSchema = zod.object({
  email: zod.string().email(),
  teamId: zod.string().min(1),
});

export const teamMemberRespondSchema = zod.object({
  hasUserAccepted: zod.boolean(),
});

export const CreateTeamSchema = zod.object({
  title: zod.string().min(1),
});

export const UpdateTeamSchema = zod.object({
  title: zod.string().min(1),
});
