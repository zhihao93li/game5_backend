import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 500, // 15 分钟
  max: 1000, // 限制每个 IP 在 windowMs 内最多可以发送 100 个请求
  standardHeaders: true, // 返回 `RateLimit-*` 头
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 头
  message: '请求过于频繁，请稍后再试。',
});

// 针对答题接口的特殊限制
export const answerRateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 分钟
  max: 10, // 限制每个 IP 在 1 分钟内最多可以提交 10 个答案
  standardHeaders: true,
  legacyHeaders: false,
  message: '答题速度过快，请稍后再试。',
});
