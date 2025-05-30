<template>
		<NavbarVue lefttitle="趣味群" title="删选" :Isleft="true" @fun="setTabid()"></NavbarVue>
	<wd-tabs v-model="tab" swipeable animated>
		<block v-for="item in wdtabs " :key="item.id">
			<wd-tab :title="item.title">
				<view class="content">


					<ScrviewVue @srctop="srctop" @srcbut="srcbut">
						<!-- 卡槽 -->
						<CartVue v-for="(group, index) in chatGroups" :key="index" :title="group.title"
							:description="group.description" :userAvatars="group.userAvatars" />
					</ScrviewVue>



				</view>
			</wd-tab>
		</block>
	</wd-tabs>


</template>

<script setup>

import NavbarVue from '../../components/Navbar.vue';
import ScrviewVue from '../../components/Scrview.vue';
import CartVue from './components/cart.vue';
import { ref } from "vue"


const chatGroups = ref([
	{
		title: '聊天群1',
		description: '这是第一个聊天群的描述',
		userAvatars: ['https://example.com/avatar1.jpg', 'https://example.com/avatar2.jpg', 'https://example.com/avatar3.jpg'],
	},
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	,
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	,
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	,
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	,
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	,
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	,
	{
		title: '聊天群2',
		description: '这是第二个聊天群的描述',
		userAvatars: ['https://example.com/avatar4.jpg', 'https://example.com/avatar5.jpg', 'https://example.com/avatar6.jpg'],
	}
	// 可以添加更多聊天群数据
]);
const srctop = async (fun) => {



	await new Promise((res, rje) => {
		setTimeout(() => {
			alert("测试")
			res("as")
		}, 1000)
	})

	fun()
}

const srcbut = async (fun) => {

	await new Promise((res, rje) => {
		setTimeout(() => {
			alert("测试")
		}, 1000)
	})

	fun()
}





const tab = ref(0)
const wdtabs = ref([
	{ id: 1, title: "兴趣" },
	{ id: 2, title: "距离" },
])
const setTabid = (e) => {
	tab.value = e.detail.current
}


</script>

<style lang="scss" scoped>
.content {
	height: 85vh;
}
</style>




<style scoped>
.group-page {
	padding: 20px;
}

.chat-group-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}
</style>