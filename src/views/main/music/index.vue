<template>
    <div class="media-container">
        <el-row :gutter="20">
            <!-- 左侧：媒体列表 -->
            <el-col :span="8">
                <el-card shadow="hover" class="list-card">
                    <template #header>
                        <div class="card-header">
                            <span>📂 媒体库</span>
                            <el-tag type="success" size="small">{{ mediaList.length }} 个资源</el-tag>
                        </div>
                    </template>

                    <el-table :data="mediaList" style="width: 100%" @row-click="handlePlay" highlight-current-row
                        height="500">
                        <el-table-column prop="title" label="标题" />
                        <el-table-column prop="artist" label="歌手" width="80" />
                        <el-table-column prop="type" label="类型" width="60">
                            <template #default="scope">
                                <el-tag :type="scope.row.type === 'video' ? 'danger' : 'primary'" size="small">
                                    {{ scope.row.type === 'video' ? 'MV' : '音频' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>

            <!-- 右侧：播放器区域 -->
            <el-col :span="16">
                <el-card shadow="never" class="player-card">
                    <div class="player-wrapper">
                        <!-- 情况1：如果是视频，显示 Video 标签 -->
                        <video v-if="currentMedia.type === 'video'" :src="currentMedia.url"
                            class="media-element video-player" controls autoplay></video>

                        <!-- 情况2：如果是音频，显示 海报 + Audio 标签 -->
                        <div v-else class="audio-view">
                            <!-- 海报 -->
                            <img :src="currentMedia.cover" alt="封面" class="media-poster" />

                            <!-- 原生音频控件 -->
                            <audio :src="currentMedia.url" ref="audioRef" controls class="native-audio-control"
                                autoplay></audio>

                            <div class="audio-info">
                                <h2>{{ currentMedia.title }}</h2>
                                <p>{{ currentMedia.artist }}</p>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'; // 确保这行在 Vue 文件中

// 定义媒体数据类型
interface MediaItem {
    title: string;
    artist: string;
    url: string;
    cover: string;
    type: 'audio' | 'video';
}

// 模拟数据
const mediaList = reactive<MediaItem[]>([
    {
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        url: '/videos/queen.mp4',
        cover: '/images/queen.jpg',
        type: 'video'
    },
    {
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        url: '/audio/shape_of_you.mp3',
        cover: '/images/ed_sheeran.jpg',
        type: 'audio'
    },
    {
        title: '夜曲',
        artist: '周杰伦',
        url: '/audio/nocturne.mp3',
        cover: '/images/jay.jpg',
        type: 'audio'
    }
]);

// 当前播放的媒体对象
const currentMedia = ref<MediaItem>(mediaList[0]);
const audioRef = ref<HTMLAudioElement | null>(null);

// 切换播放
const handlePlay = (row: MediaItem) => {
    currentMedia.value = row;
};
</script>

<style lang="less" scoped>
.media-container {
    padding: 20px;
    // background-color: #f5f7fa;
    height: 100%;
}

.list-card {
    height: 600px;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
}

.player-card {
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
}

.player-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.video-player {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
}

.audio-view {
    text-align: center;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.media-poster {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    margin-bottom: 20px;
    animation: rotateCover 20s linear infinite;
    animation-play-state: paused;
}

.native-audio-control {
    width: 80%;
    margin-bottom: 15px;
    filter: invert(1);
}

.audio-info h2 {
    margin: 0;
    font-size: 24px;
}

.audio-info p {
    margin: 5px 0 0;
    color: #aaa;
}

@keyframes rotateCover {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>