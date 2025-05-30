package com.yupi.yupao.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yupao.common.BaseResponse;
import com.yupi.yupao.common.ErrorCode;
import com.yupi.yupao.common.ResultUtils;
import com.yupi.yupao.exception.BusinessException;
import com.yupi.yupao.mapper.UserMapper;
import com.yupi.yupao.model.domain.User;
import com.yupi.yupao.model.dto.lntUserList;
import com.yupi.yupao.model.request.PostUsetList;
import com.yupi.yupao.model.request.PostaddUser;
import com.yupi.yupao.model.request.UserLoginRequest;
import com.yupi.yupao.model.request.UserRegisterRequest;
import com.yupi.yupao.model.vo.UserVO;
import com.yupi.yupao.service.UserService;
import com.yupi.yupao.utils.MailUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static com.yupi.yupao.constant.UserConstant.USER_LOGIN_STATE;

/**
 * 用户接口
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:3000"})
@Slf4j
public class UserController {

    @Resource
    private UserService userService;

    @Resource
    private UserMapper userMapper;
    @Resource
    private RedisTemplate<String, Object> redisTemplate;


    @PostMapping("/tsest")
    public BaseResponse<String> tsses() {

        return ResultUtils.success("456");
    }


    @PostMapping("/register")
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        String planetCode = userRegisterRequest.getPlanetCode();
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword, planetCode)) {
            return null;
        }
        long result = userService.userRegister(userAccount, userPassword, checkPassword, planetCode);
        return ResultUtils.success(result);
    }

    /**
     * 登录
     *
     * @param userLoginRequest
     * @param request
     * @return
     */
    @PostMapping("/login")
    public BaseResponse<User> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            return ResultUtils.error(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            return ResultUtils.error(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.userLogin(userAccount, userPassword, request);
        return ResultUtils.success(user);
    }

    @PostMapping("/logout")
    public BaseResponse<Integer> userLogout(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        int result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    @GetMapping("/current")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request) {
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User currentUser = (User) userObj;
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN);
        }
        long userId = currentUser.getId();
        // TODO 校验用户是否合法
        User user = userService.getById(userId);
        User safetyUser = userService.getSafetyUser(user);
        return ResultUtils.success(safetyUser);
    }

    @GetMapping("/search")
    public BaseResponse<List<User>> searchUsers(String username, HttpServletRequest request) {
        if (!userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(username)) {
            queryWrapper.like("username", username);
        }
        List<User> userList = userService.list(queryWrapper);
        List<User> list = userList.stream().map(user -> userService.getSafetyUser(user)).collect(Collectors.toList());
        return ResultUtils.success(list);
    }

    @GetMapping("/search/tags")
    public BaseResponse<List<User>> searchUsersByTags(@RequestParam(required = false) List<String> tagNameList) {
        if (CollectionUtils.isEmpty(tagNameList)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        List<User> userList = userService.searchUsersByTags(tagNameList);
        return ResultUtils.success(userList);
    }

    // todo 推荐多个，未实现
    @GetMapping("/recommend")
    public BaseResponse<Page<User>> recommendUsers(long pageSize, long pageNum, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        String redisKey = String.format("yupao:user:recommend:%s", loginUser.getId());
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();

        // 无缓存，查数据库
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        Page<User>  userPage = userService.page(new Page<>(pageNum, pageSize), queryWrapper);

        return ResultUtils.success(userPage);
    }


    @PostMapping("/update")
    public BaseResponse<Integer> updateUser(@RequestBody User user, HttpServletRequest request) {
        // 校验参数是否为空
        if (user == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        int result = userService.updateUser(user, loginUser);
        return ResultUtils.success(result);
    }

    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteUser(@RequestBody long id, HttpServletRequest request) {
        if (!userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH);
        }
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean b = userService.removeById(id);
        return ResultUtils.success(b);
    }

    /**
     * 获取最匹配的用户
     *
     * @param num
     * @param request
     * @return
     */
    @GetMapping("/match")
    public BaseResponse<List<User>> matchUsers(long num, HttpServletRequest request) {
        if (num <= 0 || num > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        return ResultUtils.success(userService.matchUsers(num, user));
    }

    /**
     * 注册
     */
    @PostMapping("/adduser")
    public BaseResponse<String> AddUser(@RequestBody PostaddUser postaddUser, HttpServletRequest request) {


        Object codeid = request.getSession().getAttribute("codeid");
        //对象转换为Int

        String codeidStr = codeid != null ? codeid.toString() : null;
        if (!codeidStr.equals(postaddUser.getCode())) {
            return ResultUtils.success("验证码错误");
        }


        //添加操作
        Boolean b = userService.AddLoginUser(postaddUser);

        if (!b) {
            ResultUtils.success("注册失败,系统问题");

        }
//        删除验证码信息
//        request.getSession().removeAttribute("codeid");

        return ResultUtils.success("注册成功");
    }


    /**
     * 发送验证码
     */
    @GetMapping("/emacode")
    public BaseResponse<String> GetCodeMailUser(String email, HttpServletRequest request) {


        Integer code = MailUtils.generateVerificationCode();


        request.getSession().setAttribute("codeid", code);
        try {
            MailUtils.sendMail(email, code);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR);
        }


        return ResultUtils.success("发送成功");
    }


    /**
     * 推送最近用户
     */
    @PostMapping("/userList")
    public BaseResponse<lntUserList> UserListLongitude(@RequestBody PostUsetList postUsetList, HttpServletRequest request) {
        Integer PageSize = postUsetList.getPageSize();
        Integer page = postUsetList.getPage();

        if (PageSize <= 0 || PageSize > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }



        //三木表达式  lat lng是否为空 为空赋值为 0；
        Double lat = postUsetList.getLat();

        Double lng = postUsetList.getLng();

        lat = (lat == null) ? 0.0 : lat;
        lng = (lng == null) ? 0.0 : lng;


        lntUserList lntUserList = new lntUserList();
        lntUserList.setPage(page);
        lntUserList.setPageSize(PageSize);

        long count = userService.count();
        lntUserList.setCount(count);

        List<User> nearestUsersWithPagination = userMapper.findNearestUsersWithPagination(lat, lng, PageSize, (page-1)*PageSize);

        ArrayList<UserVO> userVOS = new ArrayList<>();

        for (User user : nearestUsersWithPagination) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user,userVO);
            userVOS.add(userVO);
        }



        lntUserList.setUserVOS(userVOS);
        return ResultUtils.success( lntUserList);
    }


}
