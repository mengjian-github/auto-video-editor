#!/bin/bash

echo "🎬 自动视频剪辑工具 - 安装脚本"
echo "==============================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 请先安装 Node.js (https://nodejs.org/)"
    exit 1
fi

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 请先安装 Python 3.8+ (https://python.org/)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ Python 版本: $(python3 --version)"

# 安装 Node.js 依赖
echo ""
echo "📦 安装 Node.js 依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Node.js 依赖安装成功！"
else
    echo "❌ Node.js 依赖安装失败！"
    exit 1
fi

# 安装 Python 依赖
echo ""
echo "🐍 安装 Python 依赖..."
python3 -m pip install pyJianYingDraft

if [ $? -eq 0 ]; then
    echo "✅ Python 依赖安装成功！"
else
    echo "❌ Python 依赖安装失败！"
    exit 1
fi

echo ""
echo "🎉 安装完成！"
echo ""
echo "运行命令:"
echo "  开发模式: npm run dev"
echo "  构建应用: npm run build"
echo "  打包应用: npm run dist"
echo ""
