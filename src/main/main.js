const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../public/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // 加载应用
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../../out/index.html')}`;

  mainWindow.loadURL(startUrl);

  // 当窗口准备好时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // 开发模式下打开开发工具
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用启动时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOS 特有行为：点击 dock 图标时重新创建窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用 (除了 macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理文件选择
ipcMain.handle('select-files', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm'] },
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'aac', 'flac'] },
      { name: 'Image Files', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] },
      { name: 'Subtitle Files', extensions: ['srt', 'vtt', 'ass'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  return result;
});

// 处理文件夹选择
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  return result;
});

// 处理保存文件对话框
ipcMain.handle('save-file', async (event, defaultPath) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath || 'video_project.veproj',
    filters: [
      { name: 'JianYing Project', extensions: ['veproj'] }
    ]
  });

  return result;
});

// 调用 Python 脚本生成剪映工程文件
ipcMain.handle('generate-project', async (event, projectData) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../python/generate_project.py');
    const python = spawn('python3', [pythonScript, JSON.stringify(projectData)]);

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          reject(new Error(`解析 Python 输出失败: ${e.message}`));
        }
      } else {
        reject(new Error(`Python 脚本执行失败 (代码 ${code}): ${error}`));
      }
    });

    python.on('error', (err) => {
      reject(new Error(`启动 Python 脚本失败: ${err.message}`));
    });
  });
});

// 检查文件是否存在
ipcMain.handle('file-exists', async (event, filePath) => {
  return fs.existsSync(filePath);
});

// 读取文件信息
ipcMain.handle('get-file-info', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      name: path.basename(filePath),
      extension: path.extname(filePath)
    };
  } catch (error) {
    throw new Error(`获取文件信息失败: ${error.message}`);
  }
});
