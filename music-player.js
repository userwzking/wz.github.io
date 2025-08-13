// 音乐播放器功能
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentTrackIndex = -1;
        this.isShuffle = false;
        this.isPlaying = false;
        this.playlist = [];
        this.init();
    }

    // 初始化播放器
    async init() {
        await this.fetchPlaylist();
        this.createPlayerUI();
        this.bindEvents();
        this.loadTrack(0);
    }

    // 获取播放列表
    async fetchPlaylist() {
        try {
            const response = await fetch('https://www.hhlqilongzhu.cn/api/QQmusic_ck/music_bfq/API/index.php?sortAll=%E7%83%AD%E6%AD%8C%E6%A6%9C');
            const data = await response.json();
            
            if (data && Array.isArray(data)) {
                // 从API响应中提取需要的字段
                this.playlist = data.map((item, index) => ({
                    id: index,
                    title: item.name || '未知歌曲',
                    artist: item.artistsname || '未知艺术家',
                    url: item.url || '',
                    pic: item.picurl || ''
                })).filter(item => item.url); // 过滤掉没有URL的 track
                
                if (this.playlist.length === 0) {
                    console.error('播放列表为空或没有有效的音乐链接');
                    return;
                }
            } else {
                console.error('无法从API获取有效的播放列表数据');
            }
        } catch (error) {
            console.error('获取播放列表时出错:', error);
        }
    }

    // 创建播放器UI
    createPlayerUI() {
        // 创建播放器触发按钮
        const playerTrigger = document.createElement('div');
        playerTrigger.className = 'music-player-trigger';
        playerTrigger.innerHTML = `
            <i class="fas fa-music"></i>
        `;
        
        // 创建播放器浮窗
        const playerContainer = document.createElement('div');
        playerContainer.className = 'music-player-popup';
        playerContainer.innerHTML = `
            <div class="player-header">
                <h3>音乐播放器</h3>
                <button class="close-btn" title="关闭">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="player-content">
                <div class="album-art">
                    <i class="fas fa-compact-disc"></i>
                </div>
                <div class="track-info">
                    <div class="track-title"></div>
                    <div class="track-artist"></div>
                </div>
                <div class="progress-container">
                    <span class="current-time">00:00</span>
                    <div class="progress-bar">
                        <div class="progress"></div>
                    </div>
                    <span class="duration">00:00</span>
                </div>
                <div class="player-controls">
                    <button class="control-btn shuffle-btn" title="随机播放">
                        <i class="fas fa-random"></i>
                    </button>
                    <button class="control-btn prev-btn" title="上一首">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="control-btn play-pause-btn" title="播放/暂停">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="control-btn next-btn" title="下一首">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <button class="control-btn volume-btn" title="音量">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
        `;
        
        // 将播放器添加到页面
        document.body.appendChild(playerTrigger);
        document.body.appendChild(playerContainer);
        
        // 添加播放器样式
        const style = document.createElement('style');
        style.textContent = `
            .music-player-trigger {
                position: fixed;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(31, 41, 55, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-left: none;
                border-radius: 0 10px 10px 0;
                padding: 15px 8px;
                z-index: 1000;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
            }
            .music-player-trigger:hover {
                background: rgba(55, 65, 81, 0.95);
                transform: translateY(-50%) scale(1.05);
            }
            .music-player-trigger i {
                color: #a78bfa; /* Changed color */
                font-size: 1.5rem;
                text-shadow: 0 0 8px rgba(139, 92, 246, 0.5); /* Adjusted shadow color */
            }
            .music-player-popup {
                position: fixed;
                left: 0;
                top: 0;
                width: 350px;
                height: 100%;
                background: rgba(30, 30, 30, 0.9);
                backdrop-filter: blur(15px);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 1001;
                transform: translateX(-100%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                flex-direction: column;
                box-shadow: 5px 0 20px rgba(0, 0, 0, 0.5);
            }
            .music-player-popup.open {
                transform: translateX(0);
            }
            .player-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(31, 41, 55, 0.7);
            }
            .player-header h3 {
                margin: 0;
                color: #e5e7eb;
                font-size: 1.3rem;
                font-weight: 600;
                background: linear-gradient(to right, #a78bfa, #8b5cf6); /* Changed gradient */
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .close-btn {
                background: none;
                border: none;
                color: #9ca3af;
                font-size: 1.3rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .close-btn:hover {
                color: #a78bfa; /* Changed color */
                background: rgba(255, 255, 255, 0.1);
                transform: rotate(90deg);
            }
            .player-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 25px;
                padding: 25px;
                flex: 1;
                overflow-y: auto;
            }
            .album-art {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle at center, #1f2937, #111827);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
                transition: transform 0.5s ease; /* Added transition for pulse */
            }
            .album-art::before {
                content: '';
                position: absolute;
                width: 30px;
                height: 30px;
                background: #a78bfa; /* Changed color */
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #a78bfa; /* Adjusted shadow color */
            }
            .album-art i {
                font-size: 6rem;
                color: #9ca3af;
                animation: rotate 20s linear infinite;
                animation-play-state: paused;
                text-shadow: 0 0 10px rgba(139, 92, 246, 0.3); /* Adjusted shadow color */
            }
            .music-player-popup.playing .album-art i {
                animation-play-state: running;
            }
            .music-player-popup.playing .album-art {
                 animation: pulse 4s ease-in-out infinite alternate; /* Added pulse animation */
            }

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes pulse { /* Added pulse animation */
                0% {
                    transform: scale(1);
                }
                100% {
                    transform: scale(1.03);
                }
            }

            .track-info {
                text-align: center;
                max-width: 100%;
                overflow: hidden;
                width: 100%;
            }
            .track-title {
                font-weight: 600;
                color: #e5e7eb;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                font-size: 1.3rem;
                margin-bottom: 8px;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
            }
            .track-artist {
                font-size: 1.1rem;
                color: #9ca3af;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            .progress-container {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
            }
            .current-time, .duration {
                font-size: 0.9rem;
                color: #9ca3af;
                min-width: 40px;
                font-family: 'JetBrains Mono', monospace;
            }
            .progress-bar {
                flex: 1;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .progress-bar::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1));
                animation: progressGlow 2s infinite alternate;
            }
            @keyframes progressGlow {
                from {
                    opacity: 0.3;
                }
                to {
                    opacity: 0.7;
                }
            }
            .progress {
                height: 100%;
                background: linear-gradient(to right, #8b5cf6, #a78bfa); /* Changed gradient */
                border-radius: 3px;
                width: 0%;
                position: relative;
                box-shadow: 0 0 10px rgba(139, 92, 246, 0.5); /* Adjusted shadow color */
            }
            .progress::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3));
                border-radius: 3px;
            }
            .player-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 30px;
                width: 100%;
                margin-top: 10px;
                padding: 15px 0;
            }
            .control-btn {
                background: none;
                border: none;
                color: #d1d5db;
                font-size: 1.1rem;
                cursor: pointer;
                padding: 12px;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                position: relative;
                overflow: hidden;
            }
            .control-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(139, 92, 246, 0.1); /* Adjusted background color */
                border-radius: 50%;
                transform: scale(0);
                transition: transform 0.3s ease;
                z-index: -1;
            }
            .control-btn:hover {
                color: #a78bfa; /* Changed color */
                transform: scale(1.1);
            }
            .control-btn:hover::before {
                transform: scale(1);
            }
            .control-btn:active {
                transform: scale(0.95);
            }
            .play-pause-btn {
                width: 65px; /* Slightly increased size */
                height: 65px; /* Slightly increased size */
                font-size: 2rem; /* Increased icon size */
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            }
            .play-pause-btn::before {
                background: rgba(139, 92, 246, 0.2); /* Adjusted background color */
            }
            .shuffle-btn.active {
                color: #a78bfa; /* Changed color */
                text-shadow: 0 0 8px rgba(139, 92, 246, 0.7); /* Adjusted shadow color */
            }
            .volume-btn { /* Added style for volume button */
                 color: #d1d5db; /* Default color */
            }
            .volume-btn.muted {
                color: #ef4444; /* Muted color remains red */
            }
            .volume-btn:hover { /* Added hover effect for volume button */
                 color: #a78bfa; /* Hover color */
            }
        `;
        document.head.appendChild(style);
    }

    // 绑定事件
    bindEvents() {
        // 获取UI元素
        this.playerTrigger = document.querySelector('.music-player-trigger');
        this.playerPopup = document.querySelector('.music-player-popup');
        this.closeBtn = document.querySelector('.close-btn');
        this.trackTitle = document.querySelector('.track-title');
        this.trackArtist = document.querySelector('.track-artist');
        this.playPauseBtn = document.querySelector('.play-pause-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.shuffleBtn = document.querySelector('.shuffle-btn');
        this.volumeBtn = document.querySelector('.volume-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.duration');
        
        // 绑定按钮事件
        this.playerTrigger.addEventListener('click', () => this.togglePlayer());
        this.closeBtn.addEventListener('click', () => this.togglePlayer());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.volumeBtn.addEventListener('click', () => this.toggleVolume());
        
        // 绑定音频事件
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => this.updatePlayPauseIcon());
        this.audio.addEventListener('pause', () => this.updatePlayPauseIcon());
        
        // 绑定进度条事件
        this.progressBar.addEventListener('click', (e) => this.seek(e));
    }

    // 切换播放器显示/隐藏
    togglePlayer() {
        this.playerPopup.classList.toggle('open');
    }

    // 加载音轨
    loadTrack(index) {
        if (this.playlist.length === 0) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        this.audio.src = track.url;
        this.audio.load();
        
        // 更新UI
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // 更新按钮状态
        this.updatePlayPauseIcon();
    }

    // 播放/暂停切换
    togglePlayPause() {
        if (this.playlist.length === 0) return;
        
        if (this.audio.paused) {
            this.audio.play();
            this.isPlaying = true;
            this.playerPopup.classList.add('playing');
        } else {
            this.audio.pause();
            this.isPlaying = false;
            this.playerPopup.classList.remove('playing');
        }
    }

    // 更新播放/暂停按钮图标
    updatePlayPauseIcon() {
        const icon = this.playPauseBtn.querySelector('i');
        if (this.audio.paused) {
            icon.className = 'fas fa-play';
        } else {
            icon.className = 'fas fa-pause';
        }
    }

    // 上一首
    prevTrack() {
        if (this.playlist.length === 0) return;
        
        let newIndex;
        if (this.isShuffle) {
            newIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            newIndex = this.currentTrackIndex - 1;
            if (newIndex < 0) newIndex = this.playlist.length - 1;
        }
        
        this.loadTrack(newIndex);
        if (this.isPlaying) this.audio.play();
    }

    // 下一首
    nextTrack() {
        if (this.playlist.length === 0) return;
        
        let newIndex;
        if (this.isShuffle) {
            newIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            newIndex = this.currentTrackIndex + 1;
            if (newIndex >= this.playlist.length) newIndex = 0;
        }
        
        this.loadTrack(newIndex);
        if (this.isPlaying) this.audio.play();
    }

    // 切换随机播放
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }

    // 切换音量（静音/取消静音）
    toggleVolume() {
        this.audio.muted = !this.audio.muted;
        const icon = this.volumeBtn.querySelector('i');
        this.volumeBtn.classList.toggle('muted', this.audio.muted);
        if (this.audio.muted) {
            icon.className = 'fas fa-volume-mute';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    // 更新进度条
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progress.style.width = `${percent}%`;
        
        // 更新时间显示
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }

    // 更新总时长
    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    // 格式化时间（秒转为 mm:ss）
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 跳转到指定位置
    seek(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }
}

// 页面加载完成后初始化播放器
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});