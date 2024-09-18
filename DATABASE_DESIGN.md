# 数据库设计文档

## 用户表 (Users)

- _id: ObjectId (MongoDB自动生成的主键)
- userId: String (唯一)
- email: String (唯一, 小写, 去空格)
- passwordHash: String
- nickname: String
- googleId: String (可选)
- twitterId: String (可选)
- facebookId: String (可选)
- createdAt: Date
- updatedAt: Date

索引：
- email (唯一索引)
- userId (唯一索引)
- googleId (如果使用)
- twitterId (如果使用)
- facebookId (如果使用)

## 题库表 (QuizSets)

- _id: ObjectId (MongoDB自动生成的主键)
- quizSetId: String (唯一)
- title: String
- description: String
- totalQuestions: Number
- createdAt: Date
- updatedAt: Date

索引：
- quizSetId (唯一索引)

## 问题表 (Questions)

- _id: ObjectId (MongoDB自动生成的主键)
- questionId: String (唯一)
- quizSetId: String (关联 QuizSets 表)
- orderInSet: Number
- content: String
- options: Array of {
    optionNumber: String,
    content: String
  }
- createdAt: Date
- updatedAt: Date

索引：
- questionId (唯一索引)
- quizSetId
- (quizSetId, orderInSet) (复合索引)

注意：options 数组必须包含恰好两个选项。

## 用户答题记录表 (UserAnswerRecords)

- _id: ObjectId (MongoDB自动生成的主键)
- recordId: String (唯一, 格式: `${userId}_${quizSetId}` )
- userId: String (关联 Users 表)
- quizSetId: String (关联 QuizSets 表)
- progress: Number
- answers: Array of String
- completed: Boolean
- createdAt: Date
- updatedAt: Date

索引：
- recordId (唯一索引)
- userId
- quizSetId
- (userId, quizSetId) (复合索引)

注意：answers 数组的长度必须与相关 QuizSet 的 totalQuestions 相匹配。

## 关系

1. Users 1:N UserAnswerRecords
2. QuizSets 1:N Questions
3. QuizSets 1:N UserAnswerRecords

## 注意事项

1. 所有密码都使用 bcrypt 进行哈希处理后存储。
2. 使用 Mongoose 的 timestamps 选项自动管理 createdAt 和 updatedAt 字段。
3. 第三方认证（Google、Twitter、Facebook）的 ID 存储在用户表中，允许一个用户有多种登录方式。
4. 答题记录使用复合主键 (userId + quizSetId) 确保每个用户对每个题库只有一条记录。
5. 问题的选项直接嵌入在问题文档中，而不是单独的集合，以提高读取效率。