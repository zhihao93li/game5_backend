import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { IUser } from '../models/User';
import { RequestHandler } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置');
}

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供有效的Bearer Token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '无效的Bearer Token格式' });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded as IUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};
