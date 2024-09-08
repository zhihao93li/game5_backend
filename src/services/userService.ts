import { IUser } from '../models/User';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const userService = {
  // 获取用户信息
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  },

  // 更新用户信息
  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, userData, { new: true });
  },

  // 删除用户
  async deleteUser(userId: string): Promise<boolean> {
    const result = await User.deleteOne({ _id: userId });
    return result.deletedCount === 1;
  },

  // 修改passwordHash
  async updatePasswordHash(userId: string, newPasswordHash: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { passwordHash: newPasswordHash }, { new: true });
  } 
  
};

export default userService;
