package com.yupi.yupao.web.dmain;



import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.yupi.yupao.model.domain.Send;
import com.yupi.yupao.model.vo.UserVO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 用户列表
 */
@Data
public class Usercart {

    /**
     * 好友id
     */

    private long id;

    /**
     * 用户昵称
     */
    private String username;


    /**
     * 用户头像
     */
    private String avatarUrl;

    /**
     * 性别
     */
    private Integer gender;


    /**
     * 标签列表 json
     */
    private String tags;

    /**
     * 创建时间
     */
    private Date createTime;


    /**
     * 用户角色 0 - 普通用户 1 - 管理员
     */
    private Integer userRole;


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;


    /**
     * 简介
     */
    private String introductory;

    /**
     * 年龄
     */

    private int age;


    /**
     *
     * 最新消息数量
     */

    private  int count;

    /**
     * 是否在线
     */
    private int login;


    /**
     * 消息数量：
     */
    private  List<Send> sendList;

    /**
     * 最新消息
     * @return
     */

    private  String context;

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + id +
                ", \"username\":\"" + username + "\"" +
                ", \"avatarUrl\":\"" + avatarUrl + "\"" +
                ", \"gender\":" + gender +
                ", \"count\":" + count +
                ", \"tags\":" +tags + // 确保 tags 是合法的 JSON 数组
                ", \"createTime\":\"" + createTime + "\"" + // 将日期转换为字符串
                ", \"userRole\":" + userRole +
                ", \"introductory\":\"" + introductory + "\"" +
                ", \"age\":" + age +
                ", \"login\":" + login +
                ", \"context\":" + (context == null ? "null" : "\"" + context + "\"") +
                //sendlist的json化
                ", \"sendList\":" + (sendList == null ? "null" : convertSendListToJson(sendList)) + // sendList 的 JSON 化
                "}";


    }

    private String convertSendListToJson(List<Send> sendList) {
        if (sendList == null || sendList.isEmpty()) {
            return "[]";
        }
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < sendList.size(); i++) {
            sb.append(sendList.get(i).toString()); // 假设 Send 类也有一个 toString() 方法
            if (i < sendList.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

}
