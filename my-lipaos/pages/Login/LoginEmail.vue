<template>
	<view class="">
	<NavbarVue title="验证码登录" @fun="tabrigfun"></NavbarVue>
	

<view class="top">
	<h3>密码登录</h3>
	<uni-section title="自定义样式" subTitle="使用 styles 属性 ,可以自定义输入框样式" type="line" padding>
				<uni-easyinput  style="margin-top: 1em;" v-model="form.userAccount" :styles="styles" :placeholderStyle="placeholderStyle" placeholder="请输入内容"@input="input"></uni-easyinput>
			</uni-section>
	<uni-section  title="密码框" subTitle="指定属性 type=password 使用密码框,右侧会显示眼睛图标" type="line" padding>
				<uni-easyinput style="margin-top: 1em;" type="password" v-model="form.userPassword" placeholder="请输入密码"></uni-easyinput>
	</uni-section>
				
			
	<wd-button style="margin-top: 1em;" type="success" plain block hairline @click="gohome"> 登录</wd-button>
				
				{{store.state.user.user}}
</view>


	</view>
</template>

<script setup>
	
import NavbarVue from "../../components/Navbar.vue";	
import {ref} from "vue"
import { login ,getCurresUser} from "../../server/user";
import {throttle,debounce} from "../../util/index.js"
//登录节流
import {useStore} from "vuex"
import { addStorage,getStoage,loding } from "../../util/index.js";



const store=useStore()


const form =ref({
  "userAccount": "",
  "userPassword": ""
})



const tabrigfun=()=>{
	
	
	
}	
	
const gohome=  throttle( async ()=>{
	
	
	if(!form.value.userAccount && !form.value.userPassword)
	{
		
		return loding("输入为空")
	}
	
	
	let res=await login({...form.value})
	
	

	if(res.data)
	{
		
		//设置用户下信息
		await store.dispatch('increment')
		
		
		//存储用户信息
		
		
		addStorage(form.value)
		
		uni.switchTab({
			url:"/pages/Homefriend/index"
		})
	}
	else
	{
		loding("密码错误")
	}
	
	
},1000)

	
	
</script>

<style lang="scss" scoped>

	.top{
			width: 90%;
			margin: auto;
	}
</style>