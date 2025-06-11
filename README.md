# 🎬 自动视频剪辑工具

基于 [pyJianYingDraft](https://github.com/GuanYixuan/pyJianYingDraft) 的 Electron 桌面应用，支持上传素材并一键生成剪映工程文件。

## ✨ 功能特性

- 📁 **素材管理**: 支持上传视频、音频、图片、字幕文件
- 🎯 **一键生成**: 自动生成剪映工程文件 (.veproj)
- 🎨 **智能剪辑**: 自动添加字幕、背景音乐、转场效果
- ⚙️ **项目配置**: 可自定义分辨率、帧率、标题等参数
- 🖥️ **跨平台**: 支持 Windows、macOS、Linux

## 🚀 快速开始

### 环境要求

- Node.js 16+
- Python 3.8+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

这会同时启动 Next.js 开发服务器和 Electron 应用。

### 构建应用

```bash
npm run build
```

### 打包应用

```bash
npm run dist
```

## 📖 使用说明

1. **上传素材**: 点击对应按钮上传视频、音频、图片等文件
2. **配置项目**: 设置项目标题、分辨率、是否自动添加字幕等
3. **生成项目**: 点击"生成剪映项目"按钮，自动创建工程文件
4. **导入剪映**: 将生成的 .veproj 文件导入剪映即可开始编辑

## 🛠️ 技术栈

- **前端**: React + Next.js + Material-UI
- **桌面**: Electron
- **后端处理**: Python + pyJianYingDraft
- **构建工具**: electron-builder

## 📁 项目结构

```
auto-video-editor/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── main.js
│   │   └── preload.js
│   ├── renderer/          # 渲染进程 (Next.js)
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── python/            # Python 脚本
│       └── generate_project.py
├── public/                # 静态资源
├── scripts/               # 构建脚本
└── package.json
```

## 🔧 开发指南

### 主要组件

- `src/main/main.js`: Electron 主进程，处理窗口创建和 IPC 通信
- `src/main/preload.js`: 安全地暴露 API 给渲染进程
- `src/renderer/pages/index.js`: 主界面，包含文件上传和项目生成功能
- `src/python/generate_project.py`: Python 脚本，使用 pyJianYingDraft 生成项目

### IPC 通信

应用使用 Electron 的 IPC 机制在主进程和渲染进程间通信：

- `select-files`: 选择文件
- `select-folder`: 选择文件夹
- `save-file`: 保存文件对话框
- `generate-project`: 调用 Python 脚本生成项目

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [pyJianYingDraft](https://github.com/GuanYixuan/pyJianYingDraft) - 提供剪映工程文件生成能力
- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [Next.js](https://nextjs.org/) - React 应用框架
- [Material-UI](https://mui.com/) - React UI 组件库
