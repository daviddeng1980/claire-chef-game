# 克莱尔是个大厨师 🦞

一款养成类烹饪游戏，帮助克莱尔从新手厨师成长为五星级大厨。

## 游戏特色

- 🎮 **丰富的游戏系统**：角色成长、烹饪、比赛、任务、背包
- 🏪 **街区探索**：饭店、理发店、商场、电影院等多个场景
- 🍳 **真实烹饪体验**：QTE操作，火候控制，调味精准
- 🏆 **刺激的比赛**：从街区小厨赛到国际米其林挑战赛
- 🎲 **趣味小游戏**：石头剪刀布、记忆翻牌等
- 📱 **移动端适配**：支持手机触摸操作，响应式设计

## 技术栈

- **游戏引擎**：Phaser 3
- **前端**：HTML5 + JavaScript
- **样式**：CSS3
- **存档**：localStorage

## 项目结构

```
claire-chef-game/
├── index.html              # 入口文件
├── css/
│   └── style.css           # 样式文件
├── js/
│   ├── main.js             # 游戏入口
│   ├── config/
│   │   └── gameConfig.js   # 游戏配置
│   ├── utils/
│   │   ├── constants.js    # 常量定义
│   │   └── helpers.js      # 工具函数
│   ├── systems/
│   │   ├── SaveSystem.js   # 存档系统
│   │   ├── PlayerSystem.js # 玩家系统
│   │   ├── InventorySystem.js  # 背包系统
│   │   ├── CookingSystem.js    # 烹饪系统
│   │   └── QuestSystem.js      # 任务系统
│   ├── scenes/
│   │   ├── BootScene.js    # 启动场景
│   │   ├── MenuScene.js    # 主菜单
│   │   ├── StreetScene.js  # 街区场景
│   │   ├── CookingScene.js # 烹饪场景
│   │   ├── ShopScene.js    # 商店场景
│   │   ├── CompetitionScene.js # 比赛场景
│   │   └── MiniGameScene.js    # 小游戏场景
│   └── entities/           # 游戏实体
├── assets/                 # 游戏资源
│   ├── images/
│   ├── audio/
│   └── data/
└── README.md
```

## 开发计划

### 第一阶段：核心框架
- [x] 项目搭建 + Phaser配置
- [x] 场景管理系统
- [x] 玩家基础系统
- [x] 本地存档系统
- [x] 主界面 + 街区场景

### 第二阶段：核心玩法
- [x] 打工任务系统
- [x] 挑战小游戏
- [x] 烹饪系统
- [x] 背包系统
- [x] 商店系统

### 第三阶段：进阶系统
- [ ] 技能学习系统
- [ ] 菜谱系统
- [x] 比赛系统
- [ ] 场景解锁机制
- [ ] 成就系统

### 第四阶段：Polish
- [ ] UI美化
- [ ] 音效音乐
- [ ] 动画优化
- [ ] 性能优化

## 如何运行

1. 克隆仓库
```bash
git clone https://github.com/daviddeng1980/claire-chef-game.git
```

2. 进入项目目录
```bash
cd claire-chef-game
```

3. 启动本地服务器
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve

# 或使用 PHP
php -S localhost:8000
```

4. 打开浏览器访问 `http://localhost:8000`

## 部署

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 部署到云服务器

```bash
# 构建项目
npm run build

# 复制到服务器
scp -r dist/* user@server:/var/www/html/claire-chef-game/
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 开发者

龙虾工作室 🦞
