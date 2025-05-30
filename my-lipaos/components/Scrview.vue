<template>
	<scroll-view class="srcollview" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
		:refresher-threshold="50" refresher-background="#00ced1" @refresherpulling="onPulling"
		@refresherrefresh="onRefresh" @scrolltolower="scrbotm">

		<view class="cart">
			<view class="refresh-text" v-if="triggered">
				数据刷新中
			</view>

			<slot></slot>

			<view class="load-text" v-if="bom">
				数据加载中
			</view>
			
			<view class="text" v-if="Isbut">
				数据加载完成
			</view>
		</view>

	</scroll-view>
</template>

<script setup>
import { ref } from "vue"

const triggered = ref(false)
const bom = ref(false)

const emit = defineEmits(["srctop", "srcbut"])
//是否加载完毕 
const Isbut=ref(false)

// 取消拉取
const onRefresh = () => {
	// 加载数据
	triggered.value = true; // 开始刷新

	emit("srctop", () => { 
		triggered.value = false 
	
		Isbut.value=false 
		
		}); // 等待父组件的异步操作完成
}
// 拉取
const onPulling = () => {
	console.log("拉取");
}

const scrbotm = () => {
	
	if(Isbut.value)
	{
		console.log("加载数据了完毕了...");
		return 
	}
	
	bom.value = true
	emit('srcbut', (bool) => {
		bom.value = false
		Isbut.value=bool || false
		console.log("fuzuj",bool);
	})
}
</script>

<style lang="scss" scoped>
.srcollview {
	width: 100%;
	height: 80vh;

}

.refresh-text,
.load-text {
	text-align: center;
	font-size: 14px;
	color: #666;
	animation: fade 1.5s infinite; // 添加淡入淡出动画
}

.text{
	text-align: center;
	font-size: 14px;
	color: #666;
}

@keyframes fade {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 0.3;
	}

	100% {
		opacity: 1;
	}
}
</style>