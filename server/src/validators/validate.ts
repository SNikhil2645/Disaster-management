import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import ApiError from '../utils/ApiError';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      (req as any)[source] = parsed;
      next();
    } catch (error: any) {
      if (error?.issues) {
        const message = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ');
        next(new ApiError(400, message));
      } else {
        next(error);
      }
    }
  };
};
