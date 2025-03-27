# EpAI 前端项目

## 项目介绍

EpAI 前端项目是一个基于 Next.js 14 开发的现代化 Web 应用，提供用户登录、注册和应用市场等功能。项目使用了 React、TypeScript、Tailwind CSS 等技术栈，采用了模块化设计和组件化开发方式。

## 技术栈

- **Next.js 14**: React 框架，提供服务端渲染和静态生成等功能
- **React**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript 超集
- **Tailwind CSS**: 原子化 CSS 框架
- **Shadcn UI**: 基于 Radix UI 和 Tailwind CSS 的组件库
- **Lucide Icons**: 图标库

## 功能特性

- 用户认证系统（登录、注册、忘记密码）
- 深色/浅色主题切换
- 响应式设计，支持移动端和桌面端
- 应用市场，展示各类 AI 应用
- 集成 API 服务调用

## 目录结构

```
login-redirect/
├── app/                 # Next.js 应用目录
│   ├── login/           # 登录页面
│   ├── marketplace/     # 应用市场页面
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 应用布局
│   └── page.tsx         # 主页
├── components/          # React 组件
│   ├── ui/              # UI 组件
│   ├── login-form.tsx   # 登录表单组件
│   └── ...
├── lib/                 # 工具库
│   ├── api.ts           # API 接口
│   ├── utils.ts         # 工具函数
│   └── theme-utils.ts   # 主题相关工具
├── data/                # 静态数据
│   └── app-data.ts      # 应用数据
├── hooks/               # React Hooks
│   └── use-toast.ts     # Toast Hook
├── public/              # 静态资源
│   ├── icons/           # 图标
│   └── ...
├── next.config.mjs      # Next.js 配置
├── tailwind.config.ts   # Tailwind CSS 配置
└── tsconfig.json        # TypeScript 配置
```

## 开发指南

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn

# 使用 pnpm
pnpm install
```

### 开发服务器

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build

# 使用 pnpm
pnpm build
```

### 启动生产服务器

```bash
# 使用 npm
npm start

# 使用 yarn
yarn start

# 使用 pnpm
pnpm start
```

## 配置

项目使用环境变量进行配置，创建 `.env.local` 文件：

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8087
```

## 参与贡献

1. Fork 项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request