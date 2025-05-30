package com.yupi.yupao.mapper;

import com.yupi.yupao.model.domain.Send;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
* @author 黎旺
* @description 针对表【send(消息发送表)】的数据库操作Mapper
* @createDate 2025-04-24 12:09:19
* @Entity com.yupi.yupao.model.domain.Send
*/

@Mapper
public interface SendMapper extends BaseMapper<Send> {

    //sendIDyeslook

    /**
     * 将指定 sendId 的所有记录的 yeslook 设置为 1
     */
    int markAsReadBySendId(@Param("userId") Long userId,@Param("sendId") Long sendId);



}




