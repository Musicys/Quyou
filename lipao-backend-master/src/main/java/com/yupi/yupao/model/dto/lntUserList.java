package com.yupi.yupao.model.dto;

import com.yupi.yupao.model.request.page;
import com.yupi.yupao.model.vo.UserVO;
import lombok.Data;

import java.util.List;

@Data
public class lntUserList extends com.yupi.yupao.model.request.page {

    private  long count;

    private List<UserVO> userVOS;

}
