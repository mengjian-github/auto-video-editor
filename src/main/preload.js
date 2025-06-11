const { contextBridge, ipcRenderer } = require('electron');

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件系统操作
  selectFiles: (options) => ipcRenderer.invoke('select-files', options),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveFile: (defaultPath) => ipcRenderer.invoke('save-file', defaultPath),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),

  // 项目生成
  generateProject: (projectData) => ipcRenderer.invoke('generate-project', projectData),

  // 应用信息
  platform: process.platform,
  versions: process.versions
});
