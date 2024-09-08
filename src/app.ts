import express from 'express';
import cors from 'cors';
import passport from './config/passport';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { rateLimitMiddleware, answerRateLimitMiddleware } from './middleware/rateLimitMiddleware';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import quizSetRoutes from './routes/quizSetRoutes';
import './config/database'; // 导入数据库连接
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

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
