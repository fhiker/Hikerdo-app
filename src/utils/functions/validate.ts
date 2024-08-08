import type { ZodIssue, ZodSchema, ZodTypeAny, z } from 'zod';

type ValidateResult<O> = {
  data: O;
  errors: ZodIssue[];
};

export default function validate<T extends ZodTypeAny>(data: object, schema: T): ValidateResult<z.infer<T>> {
  const result = (schema as ZodSchema).safeParse(data);

  const validResult: ValidateResult<z.infer<T>> = { data: {}, errors: [] };

  if (!result.success) {
    validResult.errors = result.error.issues;
  } else {
    validResult.data = result.data;
  }

  return validResult;
}
