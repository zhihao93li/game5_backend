import { IUser } from '../models/User';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID 环境变量未设置');
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const AuthService = {
  async register(userData: Partial<IUser> & { userId: string, password: string }): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('用户已存在');
    }

    const newUser = new User({
      ...userData,
      passwordHash: userData.password, // 这里设置原始密码，让 Mongoose 的 pre('save') 钩子来处理哈希
    });

    return newUser.save();
  },

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('用户不存在:', email);
      throw new Error('用户不存在');
    }

    console.log('找到用户:', email);
    console.log('存储的密码哈希:', user.passwordHash);
    console.log('输入的密码:', password);
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('密码匹配结果:', isMatch);
    if (!isMatch) {
      console.log('密码不匹配:', email);
      throw new Error('密码错误');
    }

    console.log('登录成功:', email);
    const token = this.generateToken(user._id);

    return { user, token: `Bearer ${token}` };
  },

  async googleLogin(idToken: string): Promise<{ user: IUser; token: string }> {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('无效的Google令牌');
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        username: name,
        avatar: picture,
        password: await bcrypt.hash(Math.random().toString(36), 10) // 生成随机密码哈希
      });
      await user.save();
    }

    const token = this.generateToken(user._id);

    return { user, token: `Bearer ${token}` };
  },

  generateToken(userId: string): string {
    // 生成用于Bearer Token认证的JWT
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
  },

  verifyToken(token: string): { id: string, userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      return { ...decoded, userId: decoded.id }; // 添加 userId 属性
    } catch (error) {
      throw new Error('无效的令牌');
    }
  }
  
};

export default AuthService;
