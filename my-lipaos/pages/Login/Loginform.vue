<template>
	<view class="">
		<NavbarVue title="测试" @fun="tabrigfun"></NavbarVue>
	
	</view>
</template>

<script setup>
	
import NavbarVue from "../../components/Navbar.vue";	
import {ref} from "vue"
	
const tabrigfun=()=>{
	console.log("测试");
}	
	
	
	
</script>

<style scoped>
</style>