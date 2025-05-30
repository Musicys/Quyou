<template>
	<view class="page">
		
		<NavbarVue lefttitle="主页" title="删选" :Isleft="true" @fun="setTabid()">
			
			<view class="top" style="width: 100%; background: white;;">
				<wd-tabs v-model="tab" style="width: 50%;">
				  <block v-for="item in wdtabs" :key="item">
				    <wd-tab :title="`${item.title}`">
				    
				    </wd-tab>
				  </block>
				</wd-tabs>
				
				
			</view>
			
			
		</NavbarVue>
	
	<swiper :indicator-dots="false" :duration="300"  class="nr" :current='tab' @change="setTabid">
	
		<swiper-item>
		
			
			<ScrviewVue @srctop="srctop" @srcbut="srcbut">
				<!-- 卡槽 -->
				<CartVue v-for="i in aidata" :key="i.id" :data="i" ></CartVue>
			</ScrviewVue>
		</swiper-item>
		
		<swiper-item>
			
		<ScrviewVue @srctop="srctop1" @srcbut="srcbut1">
			<!-- 卡槽 -->
			<CartVue v-for="i in lntdata" :key="i.id" :data="i" ></CartVue>
		</ScrviewVue>
		</swiper-item>
	</swiper>
	

		
	
	</view>
</template>

<script setup>
import NavbarVue from "../../components/Navbar.vue";	
import ScrviewVue from "../../components/Scrview.vue";
import {onMounted, ref} from "vue"
import CartVue from "./util/Cart.vue";
import {useStore} from "vuex"
import { lntuserList ,recommendList} from "../../server/user";
import { throttle,debounce } from "../../util";
const store=useStore()

const tab = ref(0)	
const wdtabs=ref([
		{id:1,title:"兴趣"},
		{id:2,title:"距离"},
])

const lntdata=ref([])

const page1=ref({
	"page": 1,
	"pageSize": 10,
	
})

const jlcount=ref(0)


const aidata=ref([])
const page2=ref({
	  "lat": store.state.user.user.lat,
	  "lng": store.state.user.user.lng,
	  "page": 1,
	  "pageSize": 10
})
const aihcount=ref(0)

const setdata0= async ()=>{
 let res=	await recommendList({
	 "page": 1,
	 "pageSize": 10
 })
	
	console.log("0",res);
	if(res.code==0)
	{
		
	
		aidata.value=res.data.records
		aihcount.value=res.data.total

	
	}
	else
	
	{
		return
	}
	
		
		
}
	





const setdata= async ()=>{
	
 let res= await	lntuserList({
	  "lat": store.state.user.user.lat,
	  "lng": store.state.user.user.lng,
	  "page": 1,
	  "pageSize": 10
})
console.log("1",res);
if(res.code==0)
{
	
	
	
	lntdata.value=res.data.userVOS
	jlcount.value=res.data.count

}
else

{
	return
}

	
	
}






const setTabid=(e)=>{
tab.value=e.detail.current
}



//爱好推荐是否加载完毕--------------
const initaidata=async ()=>{
		page1.value.page=1
		await setdata0()
}
const addaidata=async ()=>{
		let res=	await recommendList({
			 "page": page1.value.page+1,
			 "pageSize": page1.value.pageSize
		})
		
			if(res.code==0)
			{
				
			
				aidata.value=[...aidata.value,...res.data.records]
			
				page1.value.page=page1.value.page+1
				
			
			}
			
			if(aihcount.value <=page1.value.page*page1.value.pageSize)
			{
				
				return true
			}
			
			
			return false
		
}




	//加载数据
const srctop = throttle(async (fun) => {



	await new Promise(async (res, rje) => {
	
		await initaidata()

		res()
	})

	fun()
},1000)





const srcbut = throttle(async (fun) => {
	let resd=false

	await new Promise( async (res, rje) => {
	
	
			resd=await addaidata()
					res("")
			
	
	})

	
	fun(resd)
}
,1000)

//---------------------爱好-----------------



// 距离
const initaidata1=async ()=>{
		page2.value.page=1
		await setdata0()
}
const addaidata1=async ()=>{
		let res=	await	lntuserList({
	  "lat": store.state.user.user.lat,
	  "lng": store.state.user.user.lng,
	  "page": page2.value.page+1,
	  "pageSize": page2.value.pageSize
})
			if(res.code==0)
			{
				
				console.log(res);
				lntdata.value=[...lntdata.value,...res.data.userVOS]
				
			
				page2.value.page=page2.value.page+1
				
				
			}
			
			if(jlcount.value <=page2.value.page*page2.value.pageSize)
			{
				
				return true
			}
			
			
			return false
		
}






	//加载暑假二
const srctop1 = throttle(async (fun) => {



	await new Promise(async (res, rje) => {
	
		await initaidata1()
	
		res()
	})
	
	fun()
},1000)

const srcbut1 = throttle(async (fun) => {

	let resd=false
	
	await new Promise( async (res, rje) => {
	
	
			resd=await addaidata1()
					res("")
			
	
	})
	
	
	fun(resd)
},1000)



onMounted(()=>{
		setdata()
		setdata0()
})
</script>

<style lang="scss" scoped>

	.top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.top-left{
			margin-right: 1em;
		}
	}
	.nr{
		height: 85vh;
		width: 100vw;
	
		.swiper-item{
			
			width: 100vw;
		
			
		}
	}
	
.srcollview{
	height: 100%;

	.cart{
		padding-bottom: 3em;
	}
}
</style>