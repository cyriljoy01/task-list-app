import { Request, Response, NextFunction } from 'express';

// Global error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
