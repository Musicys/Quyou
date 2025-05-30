package com.yupi.yupao.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yupao.mapper.SendMapper;
import com.yupi.yupao.model.domain.Send;
import com.yupi.yupao.service.SendService;

import org.springframework.stereotype.Service;

/**
* @author 黎旺
* @description 针对表【send(消息发送表)】的数据库操作Service实现
* @createDate 2025-04-24 12:09:19
*/
@Service
public class SendServiceImpl extends ServiceImpl<SendMapper, Send>
    implements SendService{

}




