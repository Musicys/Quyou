
package com.yupi.yupao.controller;

import com.yupi.yupao.common.BaseResponse;
import com.yupi.yupao.common.ErrorCode;
import com.yupi.yupao.common.ResultUtils;
import com.yupi.yupao.exception.BusinessException;
import com.yupi.yupao.mapper.SendMapper;
import com.yupi.yupao.model.domain.Team;
import com.yupi.yupao.model.domain.User;
import com.yupi.yupao.model.request.TeamAddRequest;
import com.yupi.yupao.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static com.yupi.yupao.constant.UserConstant.USER_LOGIN_STATE;

/**
 * 队伍接口
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@RestController
@RequestMapping("/send")
@CrossOrigin(origins = {"http://localhost:3000"})
@Slf4j
public class SendController {

    @Resource
    private UserService userService;

    @Resource
    private TeamService teamService;

    @Resource
    private UserTeamService userTeamService;


    @Resource
    private RaleService raleService;


    @Resource
    private SendService sendService;

    @Resource
    private SendMapper sendMapper;


    /**
     * 返回修改数量
     * @param sendId
     * @param request
     * @return
     */

    @GetMapping ("/sye")
    public BaseResponse<Integer> sys(Long sendId,HttpServletRequest request) {
        //根据sendid修改所有yeslook字段为1

        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;

        if(user==null)
        {
            throw new BusinessException(ErrorCode.NOT_LOGIN, "未登录");
        }

        if(sendId==null)
        {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数错误");

        }

        boolean admin = userService.isAdmin(request);

        int i = sendMapper.markAsReadBySendId(sendId,user.getId());

        return ResultUtils.success(i);



    }

    // 介绍语












}



























