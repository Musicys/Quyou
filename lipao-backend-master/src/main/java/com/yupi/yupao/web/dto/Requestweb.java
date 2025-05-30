package com.yupi.yupao.web.dto;


import lombok.Data;

import java.util.Date;

/**
 * 响应消息
 */
@Data
public class Requestweb {
    //有人发送消息给你了

    //类型 1-私聊 2-群聊
    private  int type;


    private  String data;



    @Override
    public String toString() {
        return "{"
                + "\"type\":" + type
                + ", \"data\":" + (data == null ? "null" : data)
                + "}";
    }







}
