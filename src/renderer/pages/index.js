import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Image as ImageIcon,
  Subtitles as SubtitleIcon,
  Settings as SettingsIcon,
  PlayArrow as GenerateIcon
} from '@mui/icons-material';

export default function Home() {
  const [files, setFiles] = useState({
    videos: [],
    audios: [],
    images: [],
    subtitles: []
  });

  const [projectConfig, setProjectConfig] = useState({
    title: '我的视频项目',
    resolution: '1080x1920',
    fps: 30,
    autoSubtitle: true,
    backgroundMusic: true,
    transitions: true,
    filters: true,
    outputPath: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = async (category) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      try {
        const result = await window.electronAPI.selectFiles();
        if (!result.canceled) {
          const newFiles = result.filePaths.map(path => ({
            path,
            name: path.split('/').pop(),
            type: category
          }));
          setFiles(prev => ({
            ...prev,
            [category]: [...prev[category], ...newFiles]
          }));
        }
      } catch (err) {
        setError(`选择文件失败: ${err.message}`);
      }
    }
  };

  const handleFileRemove = (category, index) => {
    setFiles(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async () => {
    if (files.videos.length === 0) {
      setError('请至少添加一个视频文件');
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);
    setError(null);
    setResult(null);

    try {
      // 模拟进度更新
      for (let i = 0; i <= 100; i += 10) {
        setGenerateProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 这里会调用 Python 脚本
      const projectData = {
        files: files,
        config: projectConfig,
        timestamp: new Date().toISOString()
      };

      // 模拟成功结果
      setResult({ segments: files.videos.length, success: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🎬 自动视频剪辑工具
      </Typography>

      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        基于 pyJianYingDraft 的智能视频剪辑助手
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 3 }}>
          项目生成成功！已创建 {result.segments || 0} 个片段。
        </Alert>
      )}

      {isGenerating && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            正在生成项目文件... {generateProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={generateProgress} />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <UploadIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                素材上传
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<VideoIcon />}
                    onClick={() => handleFileSelect('videos')}
                    sx={{ mb: 2 }}
                  >
                    添加视频 ({files.videos.length})
                  </Button>
                  {files.videos.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleFileRemove('videos', index)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AudioIcon />}
                    onClick={() => handleFileSelect('audios')}
                    sx={{ mb: 2 }}
                  >
                    添加音频 ({files.audios.length})
                  </Button>
                  {files.audios.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleFileRemove('audios', index)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                项目设置
              </Typography>

              <TextField
                fullWidth
                label="项目标题"
                value={projectConfig.title}
                onChange={(e) => setProjectConfig(prev => ({ ...prev, title: e.target.value }))}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={projectConfig.autoSubtitle}
                    onChange={(e) => setProjectConfig(prev => ({ ...prev, autoSubtitle: e.target.checked }))}
                  />
                }
                label="自动字幕"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={projectConfig.backgroundMusic}
                    onChange={(e) => setProjectConfig(prev => ({ ...prev, backgroundMusic: e.target.checked }))}
                  />
                }
                label="背景音乐"
                sx={{ mb: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<GenerateIcon />}
          onClick={handleGenerate}
          disabled={isGenerating || files.videos.length === 0}
          sx={{
            fontSize: '1.2rem',
            padding: '12px 48px',
            borderRadius: 28
          }}
        >
          {isGenerating ? '正在生成...' : '生成剪映项目'}
        </Button>
      </Box>
    </Box>
  );
}
