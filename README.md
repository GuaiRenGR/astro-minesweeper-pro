# Minesweeper Pro - 高级扫雷游戏

基于 Astro + React 开发的现代化扫雷游戏，具有精美的视觉效果、流畅的动画和丰富的游戏功能。

![Minesweeper Pro](https://img.shields.io/badge/Astro-4.x-orange) ![React](https://img.shields.io/badge/React-18.x-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 功能特性

### 核心玩法
- **多难度模式**: 初级(9×9, 10雷)、中级(16×16, 40雷)、高级(30×16, 99雷)
- **自定义模式**: 自由设置行数、列数和地雷数量
- **首次点击安全**: 第一次点击保证不会踩到地雷
- **自动展开**: 点击空白格子自动展开相邻安全区域
- **快速揭开**: 双击已揭开的数字格，当周围旗帜数等于数字时自动揭开剩余格子

### 游戏体验
- **精确计时器**: 记录游戏用时
- **地雷计数器**: 显示剩余未标记地雷数
- **最佳成绩**: 本地存储各难度最佳成绩记录
- **主题切换**: 支持明亮/暗黑两种主题
- **流畅动画**: 格子揭开、爆炸、旗帜标记等动画效果
- **响应式设计**: 完美支持桌面端和移动端

## 操作说明

| 操作 | 功能 |
|------|------|
| 左键点击 | 揭开格子 |
| 右键点击 | 标记/取消标记地雷旗帜 |
| 双击 | 快速揭开周围格子（需旗帜数等于数字） |

## 数字颜色对照

| 数字 | 颜色 | 含义 |
|------|------|------|
| 1 | 蓝色 | 周围有1个地雷 |
| 2 | 绿色 | 周围有2个地雷 |
| 3 | 红色 | 周围有3个地雷 |
| 4 | 深蓝 | 周围有4个地雷 |
| 5 | 棕色 | 周围有5个地雷 |
| 6 | 青色 | 周围有6个地雷 |
| 7 | 黑色 | 周围有7个地雷 |
| 8 | 灰色 | 周围有8个地雷 |

## 快速开始

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆项目后进入目录
cd minesweeper

# 安装依赖
npm install
```

### 运行

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

开发服务器启动后，访问 http://localhost:4321 即可开始游戏。

## 项目结构

```
minesweeper/
├── src/
│   ├── components/
│   │   ├── Game.tsx          # 游戏主组件
│   │   ├── Board.tsx         # 游戏面板
│   │   ├── Cell.tsx          # 单元格组件
│   │   ├── Header.tsx        # 头部（计时器、地雷数）
│   │   ├── Controls.tsx      # 难度控制面板
│   │   └── Modal.tsx         # 弹窗组件
│   ├── hooks/
│   │   └── useGame.ts        # 游戏状态管理Hook
│   ├── utils/
│   │   └── gameLogic.ts      # 游戏核心算法
│   ├── styles/
│   │   └── game.css          # 游戏样式
│   ├── layouts/
│   │   └── Layout.astro      # 页面布局
│   └── pages/
│       └── index.astro       # 主页面
├── public/
│   └── favicon.svg           # 网站图标
├── astro.config.mjs          # Astro配置
├── tsconfig.json             # TypeScript配置
└── package.json
```

## 技术栈

- **框架**: [Astro](https://astro.build/) - 现代静态站点生成器
- **UI库**: [React](https://react.dev/) - 通过 Astro Islands 集成
- **语言**: TypeScript
- **样式**: CSS (CSS Variables 实现主题切换)
- **存储**: LocalStorage (保存最佳成绩和主题偏好)

## 核心算法

### 地雷生成
- 首次点击后生成地雷，确保点击位置及周围8格安全
- 使用随机算法均匀分布地雷

### 自动展开
- 使用 BFS (广度优先搜索) 算法
- 点击空白格子时自动展开所有相邻的空白区域

### 胜负判定
- **胜利**: 所有非地雷格子都被揭开
- **失败**: 揭开任意一个地雷格子

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

AGPL-3.0 License
