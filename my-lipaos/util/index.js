import { StorageName,ACCESS_ENUM } from "../config/config";
import { login } from "../server/user";
import store from "../store";
    export   const debounce=(fn, delay) =>{
            let timer = null;


            return function (i) {
                let context = this;
                let args = arguments;
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }
        }




        //节流 规定时间第一次未执行，其他的不执行
   export    const  throttle=(fn, delay)=> {
            let timer = null;
            return function (i) {
                let context = this;
                let args = arguments;
                if (!timer) {
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                        timer = null;
                    }, delay);
                }
            }
        }
		
		



// 存储数据


// 获取数据
// const value = uni.getStorageSync('id');
// console.log(value);

// // 移除数据
// uni.removeStorageSync('id');
// console.log('移除成功');
		
		
export const loding=(str)=>{
		console.log(str);
}		


export const  addStorage=(obj)=>{

	
	let res=uni.getStorageSync(StorageName) || []
	let user=store.state.user.user || {}
	//判断是否时新用户 
	let bool=true
	res=res.map(item=>{
		
	
		if(item.id==user.id)
		{
			bool=false
			
			return ({...store.state.user.user,from:obj,Isloding:true})
		}
		item.Isloding=false
		return item;
	})
	
	
	//
	if(bool)
	{
		res.push({...store.state.user.user,from:obj,Isloding:true})
		
	}
	
	uni.setStorageSync(StorageName,res);
}

export const deleteStorage=(id)=>{
	uni.removeStorageSync(StorageName);
	
}		

export const getStoage=()=>{
	return uni.getStorageSync(StorageName);
}




// 自动登录 逻辑
export const IsLogin=()=>{
	return store.state.user.user.userRole==ACCESS_ENUM.USER
}

export const zdongdl= async ()=>{
	
	if(IsLogin())
	{
		
		return 
		
		
	}
	
	
	
	let res= getStoage()
	
	
		for(let i =0;i<res.length;i++)
		{

			
			
				if(res[i].Isloding)
				{
					
					//去登录请求数据为item.from
					let req=await login({...res[i].from})
					if(req.data)
					{
					
					await store.dispatch('increment')
					
					
					//存储用户信息
					}
					else
					{
						loding("用户信息失效")
					}
					
				
					
					
					
					
					
				}
		}

	
}





export const  formatTime=(inputTime)=> {
    // 创建当前时间对象和输入时间对象
    const now = new Date();
    const input = new Date(inputTime);

    // 获取当前年份、月份、日期和输入时间的年份、月份、日期
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();

    const inputYear = input.getFullYear();
    const inputMonth = input.getMonth();
    const inputDate = input.getDate();

    // 格式化时间为两位数的辅助函数
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // 如果是今天
    if (inputYear === nowYear && inputMonth === nowMonth && inputDate === nowDate) {
        const hours = padZero(input.getHours());
        const minutes = padZero(input.getMinutes());
        return `${hours}:${minutes}`;
    }
    // 如果是今年但不是今天
    else if (inputYear === nowYear) {
        const month = padZero(input.getMonth() + 1); // 月份从0开始，需要+1
        const date = padZero(input.getDate());
        const hours = padZero(input.getHours());
        const minutes = padZero(input.getMinutes());
        return `${month}-${date} ${hours}:${minutes}`;
    }
    // 如果不是今年
    else {
        const year = inputYear;
        const month = padZero(input.getMonth() + 1);
        const date = padZero(input.getDate());
        const hours = padZero(input.getHours());
        const minutes = padZero(input.getMinutes());
        return `${year}-${month}-${date} ${hours}:${minutes}`;
    }
}

