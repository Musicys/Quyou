<script setup>
import { onMounted } from 'vue';
import { zdongdl,IsLogin } from './util';
import { websocke,SocketTask } from './util/websocke';

const initail= async ()=>{
	
	await	zdongdl()
	
	
	
	if(IsLogin())
	{
		
		websocke()
		uni.switchTab({
			url:"/pages/Homefriend/index"
		})
	}
	else
	
	{
		uni.navigateTo({
			url:"/pages/Login/index"
		})
	}
	
	
	
}
onMounted(()=>{
	
	initail()
	
	console.log("这是趣友app");
	

	
	
})


</script>

<style lang="scss">
	/*每个页面公共css */
</style>
