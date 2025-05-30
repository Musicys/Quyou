<template>
	<view class="chart">

		<view class="page">
			<view class="top" >

				<wd-navbar custom-style="background: #FEF6DD;" fixed placeholder safeAreaInsetTop custom-class="nav"
					left-arrow>


					<template #left>



						<view class="search-box">
							<wd-icon @click="handleClickLeft" name="thin-arrow-left" style="margin:auto .5em;"
								size="16px"></wd-icon>


							<view class="name">
								<view class="">{{ tocart.username }}</view>


							</view>
						</view>
					</template>





					<template #title>
						<viwe class="tile">






						</viwe>
					</template>

					<template #right>
						<view class="hex">
							<image :src="tocart.avatarUrl" mode=""></image>

							<view class="aft">

							</view>


						</view>
					</template>

				</wd-navbar>

				<view class="cartxx">
					<view class="cartxx-top">
						<image :src="tocart.avatarUrl" mode="">
						</image>
						<text>{{ tocart.username }}</text>
					</view>
					<view class="cartxx-cnter">
						{{ tocart.introductory }}

					</view>
					<view class="cartxx-but">
						<wd-tag class="tag" color="#966E6E" bg-color="#F5F5F5" mark v-for="i in tocart.tags">{{ i
							}}</wd-tag>


					</view>

				</view>


				<scroll-view :show-scrollbar="false" :scroll-with-animation="Isjiaz" :scroll-y="true"  :scroll-into-view="childrenId"  class="xx-list">


					<view v-for=" (i,index) in data" :id="`id${index}`" :key="i.id">


						<view class="list-time" >{{ formatTime(i.createtime)}}</view>
						<view class="to"  v-if="Number(i.userid) == sendid">
							<image :src="tocart.avatarUrl" mode="">
							</image>
							<text>{{ i.context }}</text>
						</view>

						<view class="mine"  v-if="Number(i.userid) == store.state.user.user.id">
							<text>{{ i.context }}</text>

							<image :src="store.state.user.user.avatarUrl" mode="">
							</image>



						</view>
					</view>
				</scroll-view>




			</view >

			<view class="btom">



				<view class="shurk">
					<wd-textarea focus
						custom-style="padding: 10rpx;  padding-right:3.5em ;	max-height: 50vh;	border-radius: 15rpx;  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);"
						v-model="senform.context" :maxlength="512" auto-height />

					<view class="btom-but" @click="dosend">
						发送
					</view>

				</view>




			</view>
		</view>
	

	</view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from "vue";
import NavbarVue from "../../components/Navbar.vue";
import { send, listarr } from "../../util/websocke";
import { useStore } from "vuex";
import { onLoad ,onShow} from '@dcloudio/uni-app';
import {formatTime,throttle} from "../../util/index.js"
import {sendsye } from "../../server/send.js"



const childrenId=ref()
// 定义 xxList 的 ref
const xxList = ref(null);
const Isjiaz=ref(false)

watch(listarr.value, () => {
	listarr.value.map(item => {
		if (item.id == sendid.value) {
			data.value = item.sendList;
		}
	});
	
	setTimeout(()=>{
		
		childrenId.value=`id${data.value.length-1}`
	},300)
});

const store = useStore();
const data = ref([]);
const sendid = ref();
const tocart = ref();
const senform = ref({
	"id": store.state.user.user.id,
	"type": 3,
	"sendid": null,
	"sendteam": null,
	"context": "",
	"sendTime": new Date()
});

const tabrigfun = () => {

};

const dosend = throttle((e) => {


	// return 
	
	if(senform.value.context=="")
	{
		
		
		return ""
	}
	senform.value.context=JSON.stringify(senform.value.context).slice(1, -1);
	
	
	
	// console.log(senform.value);
	// 私聊
	send(JSON.stringify(senform.value));

	// 清空输入框
	senform.value.context = "";
	
},500)

const gohome = () => {
	uni.navigateTo({
		url: "/pages/Homefriend/index"
	});
};

function handleClickLeft() {
	uni.navigateBack();
}



const setcount= async()=>{
	
	let res= await 	sendsye(sendid.value);
	if(res.code==0)
	{
		//已经执行
	
			for(let i=0; i<listarr.value.length;i++)
			{
				
				if(listarr.value[i].id==sendid.value)
				{
					
					if(listarr.value[i].sendList.length)
					{
						for(let j=0;j<listarr.value[i].sendList.length;j++)
						{
							if(listarr.value[i].sendList[j].userid==sendid.value && listarr.value[i].sendList[j].yeslook==0 )
							{
								
								
							
								listarr.value[i].sendList[j].yeslook="1"
								
								
								
							}
						}
					}
					
				}
			}
		
		
		
	}
	
	
	
}

onMounted(() => {
	
	//进入界面调用已读接口
	
	
	console.log("123");
});


onLoad((options) => {
	// 获取并处理参数
	sendid.value = Number(options.sendId);
	//清除count
	setcount()
	
	senform.value.sendid = Number(options.sendId);
	listarr.value.map(item => {
		if (item.id == Number(options.sendId)) {
			tocart.value = item;
			data.value = item.sendList;
		}
	});
	
	setTimeout(()=>{
		
		childrenId.value=`id${data.value.length-1}`
		
			setTimeout(()=>{
				Isjiaz.value=true
			},500)
	},300)
	
});
</script>

<style lang="scss" scoped>
.list-time {
	font-size: .8em;
	text-align: center;
	margin: auto;
}

.chart {
	width: 100vw;
	height: 100vh;
	background: #F7F7F7;

}

.page {}

.tile {
	font-size: .5em;
	margin: auto 1em;
	color: #7F7F7F;
}

.nav {

	height: 200rpx;

	.search-box {
		display: flex;
		justify-content: start;
		align-items: center;
		height: 100%;


		.name {
			font-size: .7em;
			margin: auto 1em;
			display: flex;

			flex-direction: column;

			justify-content: space-between;

		}

	}
}

.hex {
	--w: 60rpx;
	display: flex;
	justify-content: start;
	align-items: center;

	position: relative;

	image {
		width: var(--w);
		height: var(--w);
		border-radius: 50%;
	}

	.aft {
		--wight: 15rpx;
		position: absolute;
		width: var(--wight);
		height: var(--wight);
		border-radius: 50%;
		background: #4CDA64;
		right: 0;
		bottom: -5rpx;
		border: 5rpx solid white;
	}

}

.top {
	width: 100%;
	background: linear-gradient(to bottom, #FEF6DD, #F7F7F7);
	width: 100%;
	height: 94vh;
	

	.cartxx {
		box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
		background: #ffffff;
		width: 80%;
		margin: 1em auto;
		padding: 1em;
		border-radius: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: start;
		--w: 60rpx;

		.cartxx-cnter {
			font-size: .8em;

		}

		image {
			width: var(--w);
			height: var(--w);
			border-radius: 50%;
			border: 5rpx solid white;
		}

		.cartxx-top {
			display: flex;
			justify-content: center;
			align-items: center;

			text {
				font-size: .8em;
				margin: auto 1em;
			}

		}

	}
}

.btom {
	display: flex;
	position: fixed;
	background: white;

	padding: 1em;
	width: 100%;
	bottom: 0;


	.shurk {
		width: 90%;
		height: 100%;
		margin: auto 1em;


	}

	.btom-but {
		position: absolute;
		background: #FCEEB0;
		color: black;
		border-radius: 15px;
		padding: 5rpx 20rpx;
		right: 3.5em;
		font-size: .8em;
		height: 1.2em;
		bottom: 2em;
	}
}



.xx-list {
	--w: 80rpx;
	height: 65vh;
	padding-bottom: 2em;


	view {
		margin-bottom: 1em;

		image {
			width: var(--w);
			height: var(--w);
			border-radius: 50%;
			margin: auto 1em;
		}
	}



	--size:.8em;
	.to {
		
		
		font-size: var(--size);
		display: flex;
		justify-content: start;
		align-items: center;

		text {
			background: #ffffff;
			border-radius: 15px;
			padding: 1em;
			max-width: 55%;
		}



	}

	.mine {
font-size: var(--size);
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;


		text {


			background: #FCEEB0;
			border-radius: 15px;
			padding: 1em;
			max-width: 55%;
		}
	}

}
</style>