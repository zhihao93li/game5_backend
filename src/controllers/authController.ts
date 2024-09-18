import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/authMiddleware';
import { IUser } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { password, ...userData } = req.body;
      const userId = uuidv4();
      const user = await AuthService.register({ ...userData, password, userId });
      res.status(201).json({ message: '注册成功', user });
    } catch (error) {
      res.status(400).json({ message: '注册失败', error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    passport.authenticate('local', { session: false }, (err: Error | null, user: IUser | null, info: { message: string }) => {
      if (err || !user) {
        return res.status(400).json({ message: '登录失败', error: info?.message });
      }
      const token = AuthService.generateToken(user._id);
      res.json({ message: '登录成功', user, token });
    })(req, res);
  }

  async registerAndLogin(req: Request, res: Response) {
    try {
      const { password, ...userData } = req.body;
      const userId = uuidv4();
      const { user, token } = await AuthService.registerAndLogin({ ...userData, password, userId });
      res.status(201).json({ message: '注册并登录成功', user, token });
    } catch (error) {
      res.status(400).json({ message: '注册并登录失败', error: (error as Error).message });
    }
  }

  logout(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ message: '登出成功' });
      });
    } else {
      res.status(401).json({ message: '未认证的用户' });
    }
  }

  googleAuth(req: Request, res: Response) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
      if (err) {
        console.error('Google认证错误:', err);
        return res.status(500).json({ message: 'Google认证过程中出错', error: err.message });
      }
      if (!user) {
        console.error('Google认证失败:', info);
        return res.status(400).json({ message: 'Google登录失败', error: info });
      }
      try {
        const token = AuthService.generateToken(user._id);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const encodedUser = encodeURIComponent(JSON.stringify(user));
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodedUser}`);
      } catch (error) {
        console.error('生成令牌时出错:', error);
        return res.status(500).json({ message: '登录过程中出错', error: (error as Error).message });
      }
    })(req, res, next);
  }

  facebookAuth(req: Request, res: Response) {
    passport.authenticate('facebook', { scope: ['email'] })(req, res);
  }

  facebookAuthCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('facebook', { session: false }, async (err: Error | null, user: IUser | null, info: { message: string }) => {
      if (err) {
        console.error('Facebook认证错误:', err);
        return res.status(500).json({ message: 'Facebook认证过程中出错', error: err.message });
      }
      if (!user) {
        console.error('Facebook认证失败:', info);
        return res.status(400).json({ message: 'Facebook登录失败', error: info });
      }
      try {
        const token = AuthService.generateToken(user._id);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const encodedUser = encodeURIComponent(JSON.stringify(user));
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodedUser}`);
      } catch (error) {
        console.error('生成令牌时出错:', error);
        return res.status(500).json({ message: '登录过程中出错', error: (error as Error).message });
      }
    })(req, res, next);
  }

  twitterAuth(req: Request, res: Response) {
    passport.authenticate('twitter')(req, res);
  }

  twitterAuthCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('twitter', { session: false }, async (err: Error | null, user: IUser | null, info: { message: string }) => {
      if (err) {
        console.error('Twitter认证错误:', err);
        return res.status(500).json({ message: 'Twitter认证过程中出错', error: err.message });
      }
      if (!user) {
        console.error('Twitter认证失败:', info);
        return res.status(400).json({ message: 'Twitter登录失败', error: info });
      }
      try {
        const token = AuthService.generateToken(user._id);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const encodedUser = encodeURIComponent(JSON.stringify(user));
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodedUser}`);
      } catch (error) {
        console.error('生成令牌时出错:', error);
        return res.status(500).json({ message: '登录过程中出错', error: (error as Error).message });
      }
    })(req, res, next);
  }
}

export const authController = new AuthController();
