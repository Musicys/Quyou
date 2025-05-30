import store from "../store/index";
import { IsLogin } from "./index.js";
import {ref,reactive} from "vue"
 
 
 //消息列表
 
 export const xxarr=ref([
	 
	 
 ])
 
 //用户列表
 export const listarr=ref([
	 
	 
	 
 ])
 
 
export let SocketTask=null;
// 创建 WebSocket 连接




export const websocke=()=>{
	
	if(SocketTask)
	{
		//关闭连接
			SocketTask.close()
		
	}
	
	if(IsLogin())
	
	{
		
			SocketTask=uni.connectSocket({
				url: `ws://192.168.14.1:8080/api/websocket/${store.state.user.user.id}`, // WebSocket 地址
				success: () => {
					console.log("WebSocket 连接创建成功");
				},
				fail: (err) => {
					console.error("WebSocket 连接创建失败", err);
				}
			});
			
		
			// 监听 WebSocket 错误事件
			SocketTask.onError((err) => {
				
				
				console.error("WebSocket 错误", err);
			});
			
			// 监听 WebSocket 关闭事件
			SocketTask.onClose(() => {
				
				
		
				console.log("WebSocket 已关闭");
			});
			
			SocketTask.onMessage((res)=>{
				
				
				console.log(res.data);
				let resd=JSON.parse(`${res.data}`)
				
				//好友列表
				if(resd.type==1)
				{
						//执行
						
						
						listarr.value=resd.data
						
					
						
				}
				
				//登录状态
				if(resd.type==2)
				{
					
			
			
				for(let i=0;i<listarr.value.length;i++)
				{
					
						
					if(listarr.value[i].id==resd.data.id)
					{
						
						
						
						
					
					listarr.value[i].login=resd.data.login
								
					
					}
					
					}
		
				
				
				}
				
				
				//添加消息
			
				if(resd.type==3)
				{
					
						
				
					for(let i=0;i<listarr.value.length;i++)
					{
							// console.log("响应数据0",listarr.value[i].id,resd.data.userid ,resd.data.sendid);
						if(listarr.value[i].id==resd.data.userid || listarr.value[i].id==resd.data.sendid)
						{
							
						
								console.log(typeof listarr.value[i].sendList,listarr.value[i].sendList);
								listarr.value[i].sendList.push(resd.data)
						
						
						
						
						}
					}
					
					
					//
					
				}
				
				//添加好友列表
				if(resd.type==4)
				{
					
					//
					listarr.value.push(resd.data)
					
				
					// uni.navigateTo({
					// 	url:`/pages/Chat/index?sendId=${resd.data.id}`
					// })
					
				}
				
				
				
				
				
			})
			
		
	
			console.log("连接了");
			
			
		
	
	}

}
export const  send=(obj)=>{
				
	SocketTask.send({
				data: obj,
			success: () => {
						console.log("发送成功");
				},
					fail: (err) => {
								console.error("发送失败", err);
				}
				})
			}












