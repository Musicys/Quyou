import  request from "../util/request.js"
import {throttle,debounce} from "../util/index.js"


export const sendsye=(senid)=>request.get(`/send/sye?sendId=${senid}`)















