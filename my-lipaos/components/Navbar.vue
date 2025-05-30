<template>
	<view class="nav">
		<wd-navbar fixed placeholder  safeAreaInsetTop @click-left="handleClickLeft" :left-arrow="!pops.Isleft">
			<template  #left v-if="pops.Isleft">
				<view class="size" >{{pops.lefttitle}}</view>
			</template>
			
		  <template #title>
		    <view class="search-box">
				<image src="/static/login.png" mode="heightFix"></image>
		    </view>
		  </template>
		  
		  <template  #right>
		  	<view class="size" @click="initail">{{pops.title}}</view>
		  </template>
		  
		</wd-navbar>
		
		<slot></slot>
	</view>



</template>

<script setup>
	import {ref} from "vue"
	
	const pops=defineProps(["lefttitle","title","Isleft"])
	
	const emit=defineEmits(["fun"])
	
	
	const initail=()=>{
		
		emit('fun')
	}
	function handleClickLeft() {
		if(pops.Isleft)
		{
			return
		}
	  uni.navigateBack()
	}
	
</script>

<style lang="scss" scoped>
	.size{
		font-size: .8em;
		
	}
	.search-box{
		
		image{
			height: 1.2em;
				
		}
	}
	.nav{
		position: sticky;
		 top: 0px;
		 z-index: 99;
	}
</style>