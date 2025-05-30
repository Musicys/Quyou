package com.yupi.yupao.web.model;


import lombok.Data;

import java.util.Date;


@Data
public class WebSend {
    //发送者id
    private long id;

    //类型 1-私聊 2-群聊 3-公告
    private  int type;

    //发送私聊人id
    private  long sendid;

    //发送群id
    private  long sendteam;


    //发送内容
    private  String context;


    //发送时间
    private Date sendTime;

    @Override
    public String toString() {
        return "{"
                + "\"id\":" + id
                + ", \"type\":" + type
                + ", \"sendid\":" + sendid
                + ", \"sendteam\":" + sendteam
                + ", \"context\":\"" + context + "\""
                + ", \"sendTime\":\"" + sendTime + "\""
                + "}";
    }

}
