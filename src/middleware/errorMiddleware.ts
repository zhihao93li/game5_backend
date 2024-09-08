import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorMiddleware = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || '服务器内部错误';

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    error: {
      status,
      message
    }
  });
};

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error: ErrorWithStatus = new Error('未找到请求的资源');
  error.status = 404;
  next(error);
};
