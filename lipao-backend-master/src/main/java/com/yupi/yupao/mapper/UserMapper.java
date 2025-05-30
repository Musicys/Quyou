package com.yupi.yupao.mapper;

// [鱼皮的知识星球](https://t.zsxq.com/0emozsIJh) 从 0 到 1 求职指导，斩获 offer！1 对 1 简历优化服务、200+ 真实简历和建议参考、2000+ 求职面试经验分享、25w 字前后端精选面试题

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yupao.model.domain.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 用户 Mapper
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
public interface UserMapper extends BaseMapper<User> {
    List<User> findNearestUsersWithPagination(
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("size") Integer size,
            @Param("offset") Integer offset);
}




