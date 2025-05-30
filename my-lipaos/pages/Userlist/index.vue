<template>

	<wd-navbar   class="nav">
		
		<template #left>
			<view style="font-size: .7em; display: flex; justify-content: center;align-items: center;margin-top: .8em;">
					{{sotre.state.user.user.username}}
				
			</view>
		</template>
			
		<template #title>
			<view class="search-box">
				<wd-search v-model="keyword" hide-cancel placeholder-left></wd-search>
			</view>
		</template>

		<template #right>
			<view class="page-right">
				<wd-img class="img" round :enable-preview="true"
					:src="sotre.state.user.user.avatarUrl"/>

			</view>
		</template>
	</wd-navbar>


	<view class="page-title">
	消息
	</view>

	<scroll-view class="srcollview" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
		:refresher-threshold="100" refresher-background="lightgreen" @refresherpulling="onPulling"
		@refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort">

		<view class="cart">
			<UserListVue v-for="i in listarr"  :key="i"   :data="i"></UserListVue>
		</view>

	</scroll-view>



 

</template>

<script setup>

import UserListVue from './util/UserList.vue';
import {listarr} from "../../util/websocke.js"
import {useStore} from "vuex"
import { onMounted,ref } from 'vue';
import { onLoad ,onShow} from '@dcloudio/uni-app';
const sotre =useStore()
const Isfalse=ref(false)


onShow(()=>{

})

onMounted(()=>{
	
	


})

</script>

<style lang="scss" scoped>
.page-right {
	--h: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;

	.img {
		width: var(--h);
		height: var(--h);
	}
}
.nav{
	margin-top: 1.5em;
	
	font-size: .8em;
}

.page-title {
	color: #7F7F7F;
	font-size: .8em;
	margin-top: 1em;
	margin-left: .5em;
	margin-bottom: 1em;
}

.srcollview {
	height: 80vh;


	.cart {
		padding-bottom: 2em;
	}
}
</style>