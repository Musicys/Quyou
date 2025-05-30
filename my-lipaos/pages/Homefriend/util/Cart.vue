<template>

	<view class="carts">
		
		<view class="cart-left" @click="gosach(1)">

			<image :src="pops.data.avatarUrl" mode="">
			</image>

			<view class="aft" v-if="pops.data.login==1">

			</view>
		</view>
		<view class="cart-right">
			<view class="cart-right-top">
				<text class="cart-right-top-title">
					
				{{pops.data.username}}

				</text>

				<text :class="IsAdd?'cart-right-top-but2':'cart-right-top-but'" @click="gosach">
					{{!IsAdd?"打招呼":"发消息"}}
				</text>
			</view>
			<view class="cart-right-center" @click="gosach(1)">
				<text> 
				<wd-icon class="icon" color="#FF69B4" name="gender-female"  v-if="pops.data.gender == 0"></wd-icon>
				<wd-icon class="icon" color="#0074D9" name="gender-male"  v-else></wd-icon>
				{{pops.data.age}}岁</text>
				·
				<text>宜春市（1km）</text>
			</view>

			<view class="cart-right-bottom" @click="gosach(1)">
				<view class="desc">{{pops.data.introductory}}</view>
			</view>



		</view>
	</view>

</template>

<script setup>
import { onMounted, ref } from "vue"
import {send} from "../../../util/websocke.js"
import {useStore} from "vuex"
import { listarr } from "../../../util/websocke.js"

//是否已经添加

const IsAdd=ref(false)


const store=useStore()
const pops=defineProps(["data"])

const gosach = async (e) => {
	if (e == 1) {
		uni.navigateTo({
			url: "/pages/Homefriend/UserHome",
			
		})

	
	}
	else {
		
		//
		if(IsAdd.value)
		{
			uni.navigateTo({
				url: `/pages/Chat/index?sendId=${pops.data.id}`
			})
			
		}
		else
		{
			send(JSON.stringify({
				"id": store.state.user.user.id,
				"type": 4,
				"sendid": pops.data.id,
				"sendteam": null,
				"context": "你好啊，我们开始聊天把-.-",
				"sendTime": new Date()
			}))
			
			IsAdd.value=true
			
			
			setTimeout(()=>{
				gosach()
			},500)
			
		}
	
		
	}

}

onMounted(()=>{
	
	//初始化
	setTimeout(()=>{
		listarr.value.map(item=>{
			if(item.id==pops.data.id)
			{
				IsAdd.value=true
			}
		})
	},500)
	
	
})


</script>

<style lang="scss" scoped>
.carts {
	width: 100vw;
	--h: 3.4em;
	--size: .7em;
	display: flex;
	justify-content: start;
	align-items: center;



	margin-bottom: .8em;

	.cart-left {
		position: relative;
		margin-right: 1em;
		margin-left: 1em;

		image {
			width: var(--h);
			height: var(--h);
			border-radius: 50%;

		}

		.aft {
			--wight: 15rpx;
			position: absolute;
			width: var(--wight);
			height: var(--wight);
			border-radius: 50%;
			background: #4CDA64;
			right: .4em;
			bottom: .4em;
			border: 5rpx solid white;
		}
	}

	.cart-right {
		flex: 1;
		font-size: var(--size);
		margin-right: 1em;

		view {
			margin-bottom: .4em;
		}

		.cart-right-top {

			display: flex;
			justify-content: space-between;
			align-items: center;

			.cart-right-top-title {}

			.cart-right-top-but {
				font-size: .8em;
				border-radius: 15px;
				border: 1rpx solid sandybrown;
				padding: 5rpx;
				margin-right: 1em;
				margin-top: .8em;
				color: sandybrown;
			}
			
			.cart-right-top-but2{
				
				font-size: .8em;
				border-radius: 15px;
				border: 1rpx solid #828282;
				padding: 5rpx;
				margin-right: 1em;
				color: #828282;
				margin-top: .8em;
			
			}
		}

		.cart-right-center {}

		.cart-right-bottom {
			width: 100%;

			.desc {
				white-space: nowrap;
				/* 禁止换行 */
				overflow: hidden;
				/* 隐藏超出部分 */
				text-overflow: ellipsis;
				/* 超出部分显示省略号 */
				width: 560rpx;
				/* 设置固定宽度（单位可以是 rpx 或 px） */
				color: rgba(0, 0, 0, .5)
			}
		}

	}
}
</style>