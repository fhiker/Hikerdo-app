import * as zod from "zod";

export const CreateProjectSchema = zod.object({
	title: zod.string().min(1),
	teamId: zod.string().min(1),
});

export const UpdateProjectSchema = zod.object({
	title: zod.string().min(1),
});
