<template>
	<div class="userlist" @click="gochat">
		<view class="left">
		
				<image :src="porps.data.avatarUrl" mode=""></image>
				
				<view class="aft" v-if="porps.data.login==1">
			
				</view>
				
		</view>
		<view class="right">
			<view class="userlist-right-top">
				<text>{{porps.data.username}}</text>
				<text>{{""}}</text>
			</view>
			
			<view class="userlist-right-but">
				<text style="flex-wrap: nowrap; line-height: 1em;margin-top: 1em;">{{ porps.data.sendList[0] ? porps.data.sendList[porps.data.sendList.length-1].context:"快开始聊天把"}}</text>
				
				<text  v-if="count!=0">{{count}}</text>
			</view>
		</view>
	</div>
			
</template>

<script setup>

import { onMounted ,ref,watch} from 'vue';
import {useStore} from "vuex"
import { onLoad ,onShow} from '@dcloudio/uni-app';
const store=useStore()

const porps=defineProps(["data"])

const count=ref(0)

const gochat=()=>{
	uni.navigateTo({
		url:`/pages/Chat/index?sendId=${porps.data.id}`
	})
}

watch(porps.data,()=>{
	
	//重新计数
		setcount()
	

})

const setcount=()=>{
	
	let arr =porps.data.sendList
	
	let number=0;
	
	arr.map(item=>{
		
		if(item.yeslook==0&&item.sendid==store.state.user.user.id)
		{
			number+=1
		}
		
	})
	
	
	count.value=number;

	
}
onShow(()=>{
	
	setcount()

})

onMounted(()=>{
		setcount()

		
})

</script>
	
<style lang="scss" scoped>
		.userlist{
			display: flex;
			--mcfonsize:.7em;
			--mctile:.6em;
				--w:80rpx;
			margin-bottom: .6em;
			.left{
				position: relative;
				
				.aft {
					--wight: 15rpx;
					position: absolute;
					width: var(--wight);
					height: var(--wight);
					border-radius: 50%;
					background: #4CDA64;
					right: .4em;
					bottom: .3em;
					border: 5rpx solid white;
				}
				image{
					width: var(--w);
					height: var(--w);
					border-radius: 50%;
					margin: auto .5em;
					
				}
		
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-right: 1em;
				.userlist-right-top{
					width: 100%;
					display: flex;
					justify-content: space-between;
					text:nth-child(1)
					{
						font-weight: 500;
						font-size: var(--mcfonsize);
					}
					
					
					text:nth-child(2)
					{
						font-size: .6em;
						
						color: #7F7F7F;
					}
					
				}
			}
			.userlist-right-but{
			width: 100%;
			display: flex;
			justify-content: space-between;
			
				text:nth-child(1)
				{
					font-size: var(--mctile);
				}
				
				
				text:nth-child(2)
				{
					
					--w:20rpx;
					width: var(--w);
					height: var(--w);
					font-size: .6em;
					display: flex;
					justify-content: center;
					align-items: center;
					color: white;
					padding: 5rpx;
					border-radius:50% ;
					background: red;
				}
			}
			
		}
</style>