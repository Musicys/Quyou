package com.yupi.yupao.model.request;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.io.Serializable;
import java.util.Date;

/**
 * 注册
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@TableName(value = "user")
@Data
public class PostaddUser implements Serializable {


    /**
     * 用户昵称
     */
    private String username;

    /**
     * 账号
     */
    private String userAccount;

    /**
     * 用户头像
     */
    private String avatarUrl;

    /**
     * 性别
     */
    private Integer gender;

    /**
     * 密码
     */
    private String userPassword;

    /**
     * 电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 标签列表 json
     */
    private String tags;

    /**
     * 验证码
     */
    private  String code;

    private BigDecimal lat; // 纬度


    private BigDecimal lng; // 经度

    private  String introductory;


    private  int age;

    private  int login;

}

// [程序员交流园地](https://www.code-nav.cn/) 从 0 到 1 求职指导，斩获 offer！1 对 1 简历优化服务、200+ 真实简历和建议参考、25w 字前后端精选面试题、2000+ 求职面试经验分享