package com.yupi.yupao.web;


import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yupi.yupao.model.domain.Rale;
import com.yupi.yupao.model.domain.Send;
import com.yupi.yupao.model.domain.User;
import com.yupi.yupao.model.vo.UserVO;
import com.yupi.yupao.service.RaleService;
import com.yupi.yupao.service.SendService;
import com.yupi.yupao.service.UserService;
import com.yupi.yupao.web.dmain.Usercart;
import com.yupi.yupao.web.dto.Requestweb;
import com.yupi.yupao.web.model.WebSend;
import com.yupi.yupao.web.util.ArryWebCartList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * @author PengPan
 * @version 1.0
 * @date 2020/7/15 18:23
 */
@ServerEndpoint(value = "/websocket/{nickname}")
@Component
@Slf4j
public class MyWebsocket {
    private static Map<String, Session> map = new HashMap<>();


    private static UserService userService;


    private static SendService sendService;


    private  static RaleService raleService;

    @Autowired
    public void RaleService(RaleService raleService) {
        MyWebsocket.raleService = raleService;
    }

    @Autowired
    public void setUserService(UserService userService) {
        MyWebsocket.userService = userService;
    }

    @Autowired
    public void setSendService(SendService sendService) {
        MyWebsocket.sendService = sendService;
    }
    private static CopyOnWriteArraySet<MyWebsocket> clients = new CopyOnWriteArraySet<>();

    private Session session;

    private String nickname;

    //好友列表
    private List<Usercart> usercartList;


    private  Usercart usercart;



    /**
     * 连接
     * @param session
     * @param nickname
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("nickname") String nickname,@PathParam("rename") String rname){


        //上线功能



        this.session = session;
        this.nickname = nickname;
        long l = Long.parseLong(nickname);


        User byId = userService.getById(l);

        if(byId.getId()!=l)
        {
            this.onClose();
        }
        else
        {
            clients.add(this);

            Usercart usercart1 = new Usercart();
            //并且设置自己的信息
            BeanUtils.copyProperties(byId,usercart1);

            this.usercart=usercart1;


            //设置在线
            byId.setLogin(1);
            userService.updateById(byId);
            //封装哈好友列表
            QueryWrapper<Rale> raleQueryWrapper = new QueryWrapper<>();
            raleQueryWrapper.eq("userId",byId.getId());
            List<Rale> list1 = raleService.list(raleQueryWrapper);
            // 提取所有 parentId
            List<Long> parentIds = list1.stream()
                    .map(Rale::getParentid)
                    .distinct() // 去重
                    .collect(Collectors.toList());
            // 根据 parentIds 查询 User
            List<User> userList = null;
            try {
                userList = userService.listByIds(parentIds);
            } catch (Exception e) {
                userList=new ArrayList<>();
            }
            ArrayList<Usercart> usercarts = new ArrayList<>();

            for (User user : userList) {
                Usercart usercart = new Usercart();
                BeanUtils.copyProperties(user,usercart);

                //查询历史
                //l自己的id user
            
                long id = usercart.getId();
                //通过mybatisluse查询 完善sendQueryWrapper ,userId 或者sendId 包含 id 或者 l 的所有数据
                QueryWrapper<Send> sendQueryWrapper = new QueryWrapper<>();
                sendQueryWrapper
                        .eq("userId", id) // userId 等于 id
                        .eq("sendId", l) // sendId 等于 id
                        .or()
                        .eq("userId", l) // userId 等于 l
                        .eq("sendId", id) // sendId 等于 l
                        .orderByAsc("createTime")
                        .last("LIMIT 20"); // 限制查询结果为最后 10 条// 按 createTime 降序排序
                // 3. 使用 sendService.list() 查询符合条件的数据

                List<Send> list = sendService.list(sendQueryWrapper);

                usercart.setSendList(list);

                usercarts.add(usercart);
                //用户在线
                if(user.getLogin()==1)
                {
                    //tuis

                    for (MyWebsocket clients : clients) {


                        long l1 = Long.parseLong(clients.nickname);
                        if(l1==user.getId())
                        {

                            Requestweb requestweb = new Requestweb();
                            requestweb.setType(2);
                            //推送自己在线
                            this.usercart.setLogin(1);
                            requestweb.setData(this.usercart.toString());
                            clients.session.getAsyncRemote().sendText(requestweb.toString());
                        }


                    }

                }


            }

            this.usercartList=usercarts;
            ArryWebCartList arryWebCartList = new ArryWebCartList();
            arryWebCartList.setUsercartList(usercarts);
            Requestweb requestweb = new Requestweb();
            requestweb.setType(1);
            requestweb.setData(arryWebCartList.toString());
//            返回好友列表
            this.session.getAsyncRemote().sendText(requestweb.toString());






        }



        log.info("有新用户加入,当前人数为：", clients.size());

    }

    /**
     * 断开
     */
    @OnClose
    public void onClose(){

        //更新离线状态
        long l = Long.parseLong(this.nickname);
        User byId = userService.getById(l);
        byId.setLogin(0);
        boolean b = userService.updateById(byId);




        for (Usercart usercart : this.usercartList) {
            if(usercart.getLogin()==1)
            {
                for (MyWebsocket client : clients) {
                    long l1 = Long.parseLong(client.nickname);

                    if(l1==usercart.getId())
                    {
                        Requestweb requestweb = new Requestweb();
                        requestweb.setType(2);

                        //
                        this.usercart.setLogin(0);
                        requestweb.setData(this.usercart.toString());
                        client.session.getAsyncRemote().sendText(requestweb.toString());
                    }


                }
            }
        }


        //给好友发送离线状态
        clients.remove(this);
        log.info("有用户断开连接,当前人数为：{}", clients.size());
    }

    /**
     * 客户端发来了消息
     * @param message
     * @param session
     * @param nickname
     */
    @OnMessage
    public void onMessage(String message, Session session, @PathParam("nickname") String nickname){
            //发送消息

        WebSend teacher = JSON.parseObject(message, WebSend.class);


        User byId = userService.getById(teacher.getId());

        if(teacher.getType()==3)
        {

            //更新数据库
            Send send = new Send();
            send.setContext(teacher.getContext());
            send.setUserid(teacher.getId());
            send.setSendid(teacher.getSendid());
            sendService.save(send);
            Long id = send.getId();
            Send byId1 = sendService.getById(id);
            //给对方返回一个新的


            Requestweb requestweb = new Requestweb();
            requestweb.setType(3);
            requestweb.setData(byId1.toString());
            this.session.getAsyncRemote().sendText(requestweb.toString());




            for (MyWebsocket client : clients) {
                long l1 = Long.parseLong(client.nickname);

                if(l1== send.getSendid())
                {


                    //
                    log.info("看着"+client.nickname);
                    client.session.getAsyncRemote().sendText(requestweb.toString());



                }

            }









        }
        else if(teacher.getType()==4)
        {

            //teacher.getId()， teacher.getId()

            System.out.println("执行"+ teacher.getSendid()+""+teacher.getId());


            //判断ralse表有没有,teacher.getSendid() teacher.getId()
            QueryWrapper<Rale> QWRale = new QueryWrapper<>();
            QWRale
                    .eq("userId",teacher.getId())
                    .eq("parentId",teacher.getSendid())
                    .or()
                    .eq("parentId",teacher.getId())
                    .eq("userId",teacher.getSendid());


            long count = raleService.count(QWRale);

            if(count!=2)
            {

                //添加好友 通知


                Rale rale = new Rale();
                Rale rale1 = new Rale();
                rale.setUserid(teacher.getId());
                rale.setParentid(teacher.getSendid());
                rale1.setUserid(teacher.getSendid());
                rale1.setParentid(teacher.getId());
                boolean b = raleService.save(rale);
                boolean b1 = raleService.save(rale1);
                if(b&&b1)
                {
//                    添加好友数据成功 把好友推送给

                    Send send = new Send();

                    send.setContext(teacher.getContext());
                    send.setUserid(teacher.getId());
                    send.setSendid(teacher.getSendid());


                    boolean save = sendService.save(send);

                    if(save)
                    {


                        QueryWrapper<Send> sendQueryWrapper = new QueryWrapper<>();
                        sendQueryWrapper.eq("sendId",teacher.getSendid())
                                .eq("userId",teacher.getId())
                                .eq("context",teacher.getContext());

                        Send one = sendService.getOne(sendQueryWrapper);
                        //添加成功后推送消息 4

                        Usercart usercart1 = this.usercart;
                        ArrayList<Send> sends = new ArrayList<>();
                        sends.add(one);
                        usercart1.setSendList(sends);


                        Requestweb requestweb = new Requestweb();
                        requestweb.setType(4);


                        for (MyWebsocket client : clients) {
                            long l = Long.parseLong(client.nickname);

                            //为对方 表示在线
                            if(l==teacher.getSendid())
                            {


                                //用户添加好友列表
                                requestweb.setData(usercart1.toString());
                                client.usercartList.add(usercart1);
                                //用户反回
                                client.session.getAsyncRemote().sendText(requestweb.toString());

                            }

                        }


                        //推送自己

                        User byId1 = userService.getById(teacher.getSendid());
                        Usercart usercart2 = new Usercart();
                        BeanUtils.copyProperties(byId1,usercart2);



                        usercart2.setSendList(sends);


                        requestweb.setData(usercart2.toString());
                        //添加好友
                        this.usercartList.add(usercart2);

                        //返回
                        this.session.getAsyncRemote().sendText(requestweb.toString());













                    }


                }

            }



        }

        //




    }

    /**
     * 出错
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error){
        log.error("出现错误");
        error.printStackTrace();
    }

    /**
     * 自定义群发消息
     * @param message
     */
    public void broadcast(String message){
        for (MyWebsocket websocket : clients){
            //异步发送消息
            websocket.session.getAsyncRemote().sendText(message);
        }
    }
}
