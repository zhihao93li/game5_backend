import express from 'express';
import cors from 'cors';
import passport from './config/passport';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { rateLimitMiddleware, answerRateLimitMiddleware } from './middleware/rateLimitMiddleware';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import session from 'express-session';
import quizSetRoutes from './routes/quizSetRoutes';
import './config/database'; // 导入数据库连接
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.set('trust proxy', 1);  // 如果在代理后面运行

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 使用 session 中间件
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false, // 改为 false
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 小时
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// 使用通用限速中间件
app.use(rateLimitMiddleware);

// 使用日志中间件
app.use(loggingMiddleware);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz-sets', quizSetRoutes);

// 在答题路由上使用特殊的限速中间件
app.use('/api/questions/submit', answerRateLimitMiddleware);

// 404 处理
app.use(notFoundMiddleware);

// 错误处理
app.use(errorMiddleware);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
