 # API 文档

## 认证相关接口

### 注册
- **URL:** `/api/auth/register`
- **方法:** `POST`
- **描述:** 用户注册
- **请求体:**
  ```typescript
  {
    email: string;    // 用户邮箱
    password: string; // 用户密码
    nickname: string; // 用户昵称
  }
  ```
- **成功响应:** 
  - **状态码:** 201
  - **响应体:**
    ```typescript
    {
      message: string; // 注册成功提示信息
      user: {
        userId: string;   // 用户唯一标识
        email: string;    // 用户邮箱
        nickname: string; // 用户昵称
      }
    }
    ```

### 登录
- **URL:** `/api/auth/login`
- **方法:** `POST`
- **描述:** 用户登录
- **请求体:**
  ```typescript
  {
    email: string;    // 用户邮箱
    password: string; // 用户密码
  }
  ```
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      message: string; // 登录成功提示信息
      user: {
        userId: string;   // 用户唯一标识
        email: string;    // 用户邮箱
        nickname: string; // 用户昵称
      };
      token: string; // JWT认证令牌
    }
    ```

### 登出
- **URL:** `/api/auth/logout`
- **方法:** `POST`
- **描述:** 用户登出
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 204

### Google 认证
- **URL:** `/api/auth/google`
- **方法:** `GET`
- **描述:** 启动 Google OAuth 认证流程

### Google 认证回调
- **URL:** `/api/auth/google/callback`
- **方法:** `GET`
- **描述:** Google OAuth 认证回调

### Facebook 认证
- **URL:** `/api/auth/facebook`
- **方法:** `GET`
- **描述:** 启动 Facebook OAuth 认证流程

### Facebook 认证回调
- **URL:** `/api/auth/facebook/callback`
- **方法:** `GET`
- **描述:** Facebook OAuth 认证回调

### Twitter 认证
- **URL:** `/api/auth/twitter`
- **方法:** `GET`
- **描述:** 启动 Twitter OAuth 认证流程

### Twitter 认证回调
- **URL:** `/api/auth/twitter/callback`
- **方法:** `GET`
- **描述:** Twitter OAuth 认证回调

### 注册并登录
- **URL:** `/api/auth/register-and-login`
- **方法:** `POST`
- **描述:** 用户注册并直接登录
- **请求体:**
  ```typescript
  {
    email: string;    // 用户邮箱
    password: string; // 用户密码
    nickname: string; // 用户昵称
  }
  ```
- **成功响应:** 
  - **状态码:** 201
  - **响应体:**
    ```typescript
    {
      message: string; // 注册并登录成功提示信息
      user: {
        userId: string;   // 用户唯一标识
        email: string;    // 用户邮箱
        nickname: string; // 用户昵称
      };
      token: string; // JWT认证令牌
    }
    ```

## 题库相关接口

### 获取所有题库
- **URL:** `/api/quiz-sets`
- **方法:** `GET`
- **描述:** 获取所有题库及用户进度
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    Array<{
      quizSetId: string;      // 题库唯一标识
      title: string;          // 题库标题
      description: string;    // 题库描述
      totalQuestions: number; // 题目总数
      progress: number;       // 用户当前进度
      completed: boolean;     // 是否完成题库
    }>
    ```

### 获取特定题库
- **URL:** `/api/quiz-sets/:quizSetId`
- **方法:** `GET`
- **描述:** 获取特定题库信息及用户进度
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      quizSetId: string;      // 题库唯一标识
      title: string;          // 题库标题
      description: string;    // 题库描述
      totalQuestions: number; // 题目总数
      progress: number;       // 用户当前进度
      completed: boolean;     // 是否完成题库
    }
    ```

### 重置用户答题记录
- **URL:** `/api/quiz-sets/reset-answer-record/:quizSetId`
- **方法:** `POST`
- **描述:** 重置用户在特定题库的答题记录
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      wasReset: boolean; // 是否成功重置
    }
    ```

### 获取答题总结
- **URL:** `/api/quiz-sets/summary/:quizSetId`
- **方法:** `GET`
- **描述:** 获取用户在特定题库的答题总结
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      answers: Array<string>; // 用户答案列表
      similarPathsCount: number; // 相似路径数量
    }
    ```

## 问题相关接口

### 获取下一个问题
- **URL:** `/api/questions/next/:quizSetId`
- **方法:** `GET`
- **描述:** 获取用户在特定题库中的下一个问题
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      questionId: string; // 问题唯一标识
      content: string;    // 问题内容
      options: Array<{
        optionNumber: string; // 选项编号
        content: string;      // 选项内容
      }>;
      orderInSet: number; // 问题在题库中的顺序
    }
    ```

### 获取特定顺序的问题
- **URL:** `/api/questions/:quizSetId/:orderInSet`
- **方法:** `GET`
- **描述:** 获取特定题库中特定顺序的问题
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      questionId: string; // 问题唯一标识
      content: string;    // 问题内容
      options: Array<{
        optionNumber: string; // 选项编号
        content: string;      // 选项内容
      }>;
      orderInSet: number; // 问题在题库中的顺序
    }
    ```

### 获取用户问题信息
- **URL:** `/api/questions/info/:quizSetId`
- **方法:** `GET`
- **描述:** 获取用户在特定题库中的问题信息
- **请求头:** 
  - `Authorization: Bearer <token>`
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      currentProgress: number;     // 当前进度
      totalQuestions: number;      // 题目总数
      nextQuestionOrder: number;   // 下一题的题目编号
      nextQuestionContent: string | null; // 下一题的题目内容
      similarPathsCount: number;   // 当前的相似答题路径数量
      completed: boolean;          // 是否已完成所有问题
    }
    ```


### 提交答案
- **URL:** `/api/questions/submit/:quizSetId`
- **方法:** `POST`
- **描述:** 提交用户对特定问题的答案
- **请求头:** 
  - `Authorization: Bearer <token>`
- **请求体:**
  ```typescript
  {
    optionNumber: string; // 选择的选项编号
    orderInSet: number;   // 问题在题库中的顺序
  }
  ```
- **成功响应:** 
  - **状态码:** 200
  - **响应体:**
    ```typescript
    {
      progress: number;         // 当前进度
      completed: boolean;       // 是否完成题库
      similarPathsCount: number; // 相似路径数量
    }
    ```

## 注意事项

1. 所有需要认证的接口都需要在请求头中包含 `Authorization: Bearer <token>`，其中 `<token>` 是用户登录后获得的 JWT 令牌。
2. 错误响应通常会包含一个 `message` 字段，说明错误原因。
3. 某些接口可能会有速率限制，超过限制可能会返回 429 状态码。