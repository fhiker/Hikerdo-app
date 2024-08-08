import * as zod from 'zod';
import { ZodSchema } from 'zod';

export const CreateTaskSchema = zod.object({
  title: zod.string().min(3),
  description: zod.string().min(3),
  listId: zod.string(),
  teamId: zod.string(),
});

export const UpdateTaskSchema = zod.object({
  title: zod.string().min(3).optional(),
  description: zod.string().min(3).optional(),
  listId: zod.string().optional(),
  position: zod.number().optional(),
  dueAt: zod.string().optional(),
  teamId: zod.string().optional(),
  assigneeId: zod.string().optional(),
  isCompleted: zod.boolean().optional(),
});

export const CreateTasklistSchema = zod.object({
  title: zod.string().min(3),
  // position: zod.string(),
  projectId: zod.string(),
});

export const UpdateTasklistSchema = zod.object({
  title: zod.string().min(3).optional(),
  position: zod.number().optional(),
});
