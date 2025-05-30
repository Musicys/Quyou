import  request from "../util/request.js"
import {throttle,debounce} from "../util/index.js"
export const  login=(obj)=> request.post("/user/login",obj)
export const current=()=> request.get("/user/current");
export const  getCurresUser=()=>request.get("/user/current",{})
export const lntuserList=(obj)=>request.post("/user/userList",obj)
export const recommendList=(obj)=>request.get(`/user/recommend?pageNum=${obj.page}&pageSize=${obj.pageSize}`)

















