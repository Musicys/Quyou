<template>
	<view class="page">
		<NavbarVue :Isleft="false" @fun="setTabid()"></NavbarVue>

		<view class="img-src">
			<wd-img :width="100" :height="100" round :enable-preview="true"
				src="https://tse1-mm.cn.bing.net/th/id/OIP-C.P1ulnzT1FEbiQfMMDQFMIAHaHa?rs=1&pid=ImgDetMain" />


		</view>


		<view class="userxx">
			<view class="title-name">
				呆呆小萌兽
			</view>

			<view class="xires">
				<wd-tag custom-class="space" type="success">20</wd-tag>
				<wd-tag custom-class="space" type="warning">宜春</wd-tag>
				<wd-tag custom-class="space" type="warning">刚刚在线</wd-tag>
			</view>

			<view class="desc">
				我时一个帅气的人， 我时一个帅气的人，想找个男人一起学java 我时一个帅气的人，想找个男人一起学java想找个男人一起学java
			</view>



			<view class="flex-list-tag">

				<wd-tag class="tag" color="#966E6E" bg-color="#F5F5F5" mark v-for="i in 20">标签</wd-tag>


			</view>

			<view class="img-list">

				<wd-img class="img"
					src="https://tse1-mm.cn.bing.net/th/id/OIP-C.P1ulnzT1FEbiQfMMDQFMIAHaHa?rs=1&pid=ImgDetMain"
					:enable-preview="true" v-for="i in 5" />
			</view>

			<hr />
			<view class="top">
				<wd-tabs v-model="tab" style="width: 50%;">
					<block v-for="item in wdtabs" :key="item">
						<wd-tab :title="`${item.title}`">

						</wd-tab>
					</block>
				</wd-tabs>


			</view>

			<swiper :indicator-dots="false" :duration="300" class="nr" :current='tab' @change="setTabid">

				<swiper-item>

				</swiper-item>

				<swiper-item>

				</swiper-item>
			</swiper>
		</view>



	</view>
</template>

<script setup>
import NavbarVue from "../../components/Navbar.vue";

import { ref } from "vue"


const tab = ref(0)
const wdtabs = ref([
	{ id: 1, title: "动态" },
	{ id: 2, title: "照片墙" },
])
const setTabid = (e) => {
	tab.value = e.detail.current
}





// 滚动条

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









</script>

<style lang="scss" scoped>
.group-page {
	padding: 20px;
}

.chat-group-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.page {
	.img-src {
		margin-top: 1em;
		display: flex;
		justify-content: center;
		align-self: center;

	}

	.userxx {
		margin-top: 1em;

		.title-name {
			font-weight: bold;
			text-align: center;
			font-size: 1.2em;
		}

		.xires {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: .5em;

			.space {
				--h: .5em;
				padding: 2rpx;
				margin-right: var(--h);
				margin-left: var(--h);
			}
		}

		.desc {
			font-size: 1em;
			margin: 1em auto;
		}

		.flex-list-tag {

			display: flex;
			flex-wrap: wrap;
			justify-content: start;
			margin: 1em auto;

			.tag {

				font-size: .8em;
				margin: auto 1em;

			}
		}

		.img-list {
			margin: .5em auto;
			overflow: hidden;

			--w: 80rpx;
			// width: ;

			flex-wrap: nowrap;

			.img {
				display: inline-block;
				width: var(--w);
				margin: auto .5em;
				height: var(--w);
			}
		}
	}



}

.top {
	display: flex;
	justify-content: center;

}

.nr {
	height: 65vh;
	width: 100vw;

	.swiper-item {
		height: 100%;
		width: 100vw;


	}
}
</style>