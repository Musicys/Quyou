
import { ACCESS_ENUM  } from "../../config/config";
import { login,current } from "../../server/user"


export default {
    state: () => ({
        user: {
            "userName": "未登录",
            "userRole": "notLogin",
        }
    }),
    mutations: {
        // @ts-ignore
        increment(state, user) {
            // 变更状态
            state.user = user
        }
    },
    actions: {
        // @ts-ignore
        async increment(context) {


            // context.commit('increment', {
            //     "userName": "user",
            //     "userRole": "Login",
            // })
		
            const loginuser = await current()
    	


            if (loginuser.code == 0 && loginuser.data!=null) {
			
                context.commit('increment', {...loginuser.data,"userRole":ACCESS_ENUM.USER})
            }
            else {
				
		
                context.commit('increment', {
                    "userName": "未登录",
                    "userRole": ACCESS_ENUM.NO_LOGIN,
                })
            }



        }

    }
} 