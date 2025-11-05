import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validación fallida');
    error.status = 400;
    error.details = errors.array();
    return next(error);
  }
  next();
};
