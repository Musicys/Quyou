<template>
	<NavbarVue lefttitle="我的" title="删选" :Isleft="true" @fun="setTabid()"></NavbarVue>
	<view class="page">
		<!-- 前三层卡片 -->
		<view class="info-card">
			<!-- 第一层：头像、名称、年龄 -->
			<view class="first-layer">
				<wd-img :width="100" :height="100" round :enable-preview="true"
					src="https://tse1-mm.cn.bing.net/th/id/OIP-C.P1ulnzT1FEbiQfMMDQFMIAHaHa?rs=1&pid=ImgDetMain" />
				<view class="name-age">
					<text class="name">呆呆小萌兽</text>
					<text class="age">20</text>
				</view>
			</view>
			<!-- 第二层：标签和添加标签 -->
			<view class="second-layer">
				<view class="tags">
					<wd-tag custom-class="space" type="warning" v-for="(tag, index) in tags" :key="index">
						{{ tag }}
					</wd-tag>
				</view>
				<button class="add-tag-btn" @click="addTag">添加标签</button>
			</view>
			<!-- 第三层：简介和修改按钮 -->
			<view class="third-layer">
				<text class="description">{{ description }}</text>
				<button class="modify-btn" @click="modifyDescription">修改</button>
			</view>
		</view>
		<!-- 动态和相册标签栏切换 -->
		<view class="top">
			<wd-tabs v-model="tab" style="width: 50%;">
				<block v-for="item in wdtabs" :key="item.id">
					<wd-tab :title="item.title"></wd-tab>
				</block>
			</wd-tabs>
		</view>
		<swiper :indicator-dots="false" :duration="300" class="nr" :current="tab" @change="setTabid">
			<swiper-item></swiper-item>
			<swiper-item></swiper-item>
		</swiper>
	</view>

</template>

<script setup>
import { ref } from 'vue';
import NavbarVue from "../../components/Navbar.vue";

// 标签数据
const tags = ref(['标签1', '标签2', '标签3']);
// 简介数据
const description = ref('这是一段个人简介，可以在这里修改。');
// 标签栏当前选中项
const tab = ref(0);
// 标签栏数据
const wdtabs = ref([
	{ id: 1, title: '动态' },
	{ id: 2, title: '相册' },
]);

// 添加标签方法，这里可以添加具体逻辑
const addTag = () => {
	console.log('点击添加标签');
};

// 修改简介方法，这里可以添加具体逻辑
const modifyDescription = () => {
	console.log('点击修改简介');
	
	uni.navigateTo({
		url:"/pages/Login/LoginEmail"
	})
};



// 切换标签栏方法
const setTabid = (e) => {
	tab.value = e.detail.current;
};
</script>

<style lang="scss" scoped>
.page {
	padding: 20px;
}

.info-card {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	padding: 20px;
	margin-bottom: 20px;
}

.first-layer {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
}

.name-age {
	text-align: center;
}

.name {
	font-weight: bold;
	font-size: 1.2em;
	display: block;
}

.age {
	font-size: 1em;
	color: #666;
}

.second-layer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.tags {
	display: flex;
	flex-wrap: wrap;
}

.space {
	--h: 0.5em;
	padding: 2rpx;
	margin-right: var(--h);
	margin-left: var(--h);
	margin-bottom: 10px;
}

.add-tag-btn {
	font-size: 0.8em;
	padding: 5px 10px;
	background-color: #007aff;
	color: #fff;
	border-radius: 5px;
}

.third-layer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.description {
	flex: 1;
	font-size: 1em;
}

.modify-btn {
	font-size: 0.8em;
	padding: 5px 10px;
	background-color: #007aff;
	color: #fff;
	border-radius: 5px;
	margin-left: 20px;
}

.top {
	display: flex;
	justify-content: center;
}

.nr {
	height: 65vh;
	width: 100vw;
}

.swiper-item {
	height: 100%;
	width: 100vw;
}
</style>