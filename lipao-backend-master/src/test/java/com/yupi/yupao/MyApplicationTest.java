package com.yupi.yupao;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yupao.mapper.SendMapper;
import com.yupi.yupao.mapper.UserMapper;
import com.yupi.yupao.model.domain.Rale;
import com.yupi.yupao.service.RaleService;
import com.yupi.yupao.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.DigestUtils;

import javax.annotation.Resource;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 测试类
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@SpringBootTest
class MyApplicationTest {

    @Resource
    UserService userService;

    @Resource
    UserMapper userMapper;

    @Resource
    SendMapper sendMapper;

    @Resource
    RaleService raleService;
    void testDigest() throws NoSuchAlgorithmException {
        String newPassword = DigestUtils.md5DigestAsHex(("abcd" + "mypassword").getBytes());
        System.out.println(newPassword);
    }

    @Test
    void contextLoads() {



//            sendMapper.markAsReadBySendId(26753L);


    }

}
