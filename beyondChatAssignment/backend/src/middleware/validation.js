import { ZodError } from 'zod';
import { ValidationError, BadRequestError } from '../utils/errors.js';

export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req[source]);
      
      req[source] = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        next(new ValidationError(formattedErrors));
      } else {
        next(new BadRequestError('Invalid request data'));
      }
    }
  };
};

export const validateBody = (schema) => validate(schema, 'body');

export const validateParams = (schema) => validate(schema, 'params');

export const validateQuery = (schema) => validate(schema, 'query');

export default {
  validate,
  validateBody,
  validateParams,
  validateQuery,
};
