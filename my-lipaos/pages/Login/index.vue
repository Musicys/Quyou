<template>
		
			<view class="page">
				
				
				<view class="page-top">
					<image src="../../static/login.png" mode="widthFix" ></image>
					
					
					<h1>趣友</h1>
					
					<text>这是个兴趣爱号的交友平台</text>
					
				</view>
				
				
				<view class="page-butom">
					
					
					<view class="green" @click="goLoginform(1)">
						<wd-icon name="mail" size="22px"></wd-icon><text>邮箱注册</text>
					</view>
					
					<view class="word" @click="goLoginform(2)">
							<wd-icon name="mail" size="22px"></wd-icon><text>账号登录</text>
					</view>	
					
					
					<view class="box">
						<label>
							<checkbox class="box-check" :checked="Isyuedu"  @click="change"/>
							
							<text>
								
								我已经阅读趣友的
								
								<text>《用户协议》</text>
								和
								<text>《隐私策略》</text>
								
							</text>
						</label>
						
					</view>
						
				</view>
			</view>
		<wd-action-sheet v-model="show"  title="提示"  @close="close">
		 
			<view class="cart">
				<h1>请阅读以下条款</h1>
				<text>
					
					我已经阅读趣友的
					
					<text>《用户协议》</text>
					和
					<text>《隐私策略》</text>
					
					
					
				</text>
				
				
				<view class="but" @click="gohede">
					同意并继续
				</view>
			</view>
		</wd-action-sheet>
</template>

<script setup>

import { onMounted,ref } from 'vue';
import { useStore } from 'vuex';
import {ACCESS_ENUM} from "../../config/config"
const store=useStore()
/*
	未登录
*/
const IslDing=ref(false)
const Isyuedu=ref(false)
const show=ref(false)

let bye=1;

const change=()=>{
	Isyuedu.value=!Isyuedu.value
	console.log(Isyuedu.value);
}
const goLoginform=(e)=>{
	

	if(!Isyuedu.value)
	{
		show.value=true
		bye=e
		
			return 
	}
		
	
		
	
	
	
	if(e==1)
	{
		uni.navigateTo({
			url:"/pages/Login/LoginEmail"
		})
	}
	else
	{
		uni.navigateTo({
			url:"/pages/Login/Loginform"
		})
	}
	
	
	
}


const gohede=()=>{
	
	Isyuedu.value=true
	goLoginform(bye)
	show.value=false
}


const inInt=()=>{
	if(store.state.user.user==ACCESS_ENUM.USER)
	{
		IslDing.value=true
		console.log("用户已经登录");
		uni.navigateTo({
			url: "/pages/Homefriend/index"
		});
	
	
	}
	


	
}

onMounted(()=>{
	
		inInt()
	

	
})

</script>
	
<style lang="scss" scoped>
	.cart{
		padding: 1me;
		width: 80%;
		margin: auto;
		height: 25vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		h1{
			font-size: 1.5em;
		}
		text{
			font-size: .8em;
		}
		
		.but{
			width: 100%;
			margin:  auto;
			margin-top: 3em;
			border-radius: 15rpx;
			font-size: .8em;
			height: 3em;
			display: flex;
			justify-content: center;
			align-items: center;
			background: blue;
			border: 1rpx solid black ;
			color: white;
		}
	}
.page{
	display: flex;
	flex-direction: column;
	
	width: 100vw;
	height: 100vh;
	justify-content: space-between;
	
	.page-top{
		display: flex;
		flex-direction: column;
	
		justify-content: start;
		align-self: center;
		
		image{
			
			width: 5em;
		
			text-align: center;			
			margin: auto;
				margin-top: 5em;
			
		}
		h1{
			margin-top: .5em;
			font-size: 1.8em;
			text-align: center;
		
		
		}
		
		
			
		text{
			margin-top: 1em;
			font-size: .8em;
			text-align: center;
			color: rgba(0, 0, 0, .6);
		}
		
	}
	.page-butom{
		
		
		&>view{
			
	
			width: 80%;
			margin: 1em auto;
			border-radius: 15rpx;
			font-size: .8em;
				height: 3em;
				width: 80%;
				
				display: flex;
				justify-content: center;
				
				align-items: center;
			&>text{
				margin-left: .5em;
			}
			
		}
		.green
			{
			
				background: green;
			border: 1rpx solid black ;
			}
			
			.word
			{
				
		border: 1rpx solid black ;
				background: yellow;
			
			}
		
		.box{
			display: flex;
			justify-content: center;
			
			align-items: center;
			font-size: .6em;
			width: 80%;
			.box-check{
				transform:scale(0.7);
			
				&>text{
					color: rgba(0, 0, 0, .6);
					
				}
			}

		}
	}
}
</style>