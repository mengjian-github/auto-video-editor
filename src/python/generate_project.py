#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动视频剪辑工具 - 项目生成脚本
基于 pyJianYingDraft 生成剪映工程文件
"""

import sys
import json
import os
from pathlib import Path
import subprocess

# 检查并安装 pyJianYingDraft
def ensure_dependencies():
    """确保依赖包已安装"""
    try:
        import pyJianYingDraft as draft
        return True
    except ImportError:
        try:
            print("正在安装 pyJianYingDraft...", file=sys.stderr)
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pyJianYingDraft"])
            import pyJianYingDraft as draft
            return True
        except Exception as e:
            print(f"安装 pyJianYingDraft 失败: {e}", file=sys.stderr)
            return False

def create_video_project(project_data):
    """创建视频项目"""
    try:
        import pyJianYingDraft as draft

        files = project_data.get('files', {})
        config = project_data.get('config', {})

        # 解析分辨率
        resolution = config.get('resolution', '1080x1920')
        width, height = map(int, resolution.split('x'))

        # 创建脚本文件
        script = draft.Script_file(width, height)

        # 添加视频文件
        video_files = files.get('videos', [])
        audio_files = files.get('audios', [])

        current_time = 0
        segments_created = 0

        for i, video_file in enumerate(video_files):
            file_path = video_file.get('path')
            if not os.path.exists(file_path):
                print(f"警告：视频文件不存在 {file_path}", file=sys.stderr)
                continue

            # 创建视频片段（假设每个视频5秒）
            duration = 5.0
            video_segment = draft.Video_segment(
                file_path,
                draft.trange(current_time, current_time + duration)
            )

            # 添加到主视频轨道
            script.add_segment(video_segment, track_name="main_video")

            # 如果启用了自动字幕
            if config.get('autoSubtitle', False):
                # 添加示例字幕
                subtitle_text = f"视频片段 {i+1}"
                text_segment = draft.Text_segment(
                    subtitle_text,
                    draft.trange(current_time, current_time + duration),
                    style=draft.Text_style(size=5.0, color=(1.0, 1.0, 1.0)),
                    clip_settings=draft.Clip_settings(transform_y=-0.8)
                )
                script.add_segment(text_segment, track_name="subtitle")

            current_time += duration
            segments_created += 1

        # 添加背景音乐
        if config.get('backgroundMusic', False) and audio_files:
            audio_file = audio_files[0]
            if os.path.exists(audio_file.get('path')):
                audio_segment = draft.Audio_segment(
                    audio_file.get('path'),
                    draft.trange(0, current_time)
                )
                script.add_segment(audio_segment, track_name="background_music")

        # 生成输出文件路径
        output_dir = Path.home() / "Desktop"
        output_file = output_dir / f"{config.get('title', '视频项目')}.veproj"

        # 导出项目文件
        script.export(str(output_file))

        # 返回结果
        result = {
            "success": True,
            "segments": segments_created,
            "output_file": str(output_file),
            "duration": current_time,
            "resolution": f"{width}x{height}"
        }

        print(json.dumps(result, ensure_ascii=False))
        return True

    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "segments": 0
        }
        print(json.dumps(error_result, ensure_ascii=False))
        return False

def main():
    """主函数"""
    if len(sys.argv) != 2:
        print(json.dumps({
            "success": False,
            "error": "需要提供项目数据参数"
        }, ensure_ascii=False))
        sys.exit(1)

    # 确保依赖已安装
    if not ensure_dependencies():
        print(json.dumps({
            "success": False,
            "error": "无法安装或导入 pyJianYingDraft"
        }, ensure_ascii=False))
        sys.exit(1)

    try:
        # 解析项目数据
        project_data = json.loads(sys.argv[1])

        # 创建项目
        if create_video_project(project_data):
            sys.exit(0)
        else:
            sys.exit(1)

    except json.JSONDecodeError as e:
        print(json.dumps({
            "success": False,
            "error": f"JSON 解析错误: {e}"
        }, ensure_ascii=False))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"未知错误: {e}"
        }, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
