<template>
    <view class="chat-group-card" :style="{ background: randomGradient }">
        <view class="card-header">
            <text class="card-title">{{ title }}</text>
            <text class="online-count">在线人数: {{ onlineCount }}</text>
        </view>
        <view class="card-description">
            <text>{{ description }}</text>
        </view>
        <view class="avatars-and-button">
            <view class="user-avatars">
                <image v-for="(avatar, index) in userAvatars.slice(0, 3)" :key="index" :src="avatar" class="avatar" />
            </view>
            <view class="join-button" @click="handleJoin">加入</view>
        </view>
    </view>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    userAvatars: {
        type: Array,
        default: () => [],
    },
    onlineCount: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['join']);

// 生成随机渐变颜色
const randomGradient = computed(() => {
    const colors = [
        'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
        'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
});

const handleJoin = () => {
    emit('join', props.title);
};
</script>

<style scoped>
.chat-group-card {
    border-radius: 16px;
    padding: 20px;
    margin: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    min-width: calc(50% - 24px);
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out;
    /* 添加背景渐变过渡效果 */
    transition: background 1s ease;
}

.chat-group-card:hover {
    transform: translateY(-4px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.card-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.online-count {
    font-size: 14px;
    color: #666;
}

.card-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
    min-height: 42px;
}

.user-avatars {
    display: flex;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: -12px;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatars-and-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.join-button {
    background-color: #007AFF;
    color: white;
    border-radius: 20px;
    font-size: 14px;
    padding: 6px 12px;
    margin-top: 0;
    border: none;
    outline: none;
    transition: opacity 0.2s ease-in-out;
    min-width: auto;
}

.join-button:hover {
    opacity: 0.9;
}
</style>