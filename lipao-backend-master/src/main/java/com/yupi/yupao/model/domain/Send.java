package com.yupi.yupao.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 消息发送表
 * @TableName send
 */
@TableName(value ="send")
@Data
public class Send implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 发送内容
     */
    private String context;

    /**
     * 用户id
     */
    private Long userid;

    /**
     * 接受者 id
     */
    private Long sendid;

    /**
     * 0 - 未查看, 1 - 已经查看
     */
    private Integer yeslook;

    /**
     * 创建时间
     */
    private Date createtime;

    /**
     * 是否删除
     */
    private Integer isdelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Send other = (Send) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getContext() == null ? other.getContext() == null : this.getContext().equals(other.getContext()))
            && (this.getUserid() == null ? other.getUserid() == null : this.getUserid().equals(other.getUserid()))
            && (this.getSendid() == null ? other.getSendid() == null : this.getSendid().equals(other.getSendid()))
            && (this.getYeslook() == null ? other.getYeslook() == null : this.getYeslook().equals(other.getYeslook()))
            && (this.getCreatetime() == null ? other.getCreatetime() == null : this.getCreatetime().equals(other.getCreatetime()))
            && (this.getIsdelete() == null ? other.getIsdelete() == null : this.getIsdelete().equals(other.getIsdelete()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getContext() == null) ? 0 : getContext().hashCode());
        result = prime * result + ((getUserid() == null) ? 0 : getUserid().hashCode());
        result = prime * result + ((getSendid() == null) ? 0 : getSendid().hashCode());
        result = prime * result + ((getYeslook() == null) ? 0 : getYeslook().hashCode());
        result = prime * result + ((getCreatetime() == null) ? 0 : getCreatetime().hashCode());
        result = prime * result + ((getIsdelete() == null) ? 0 : getIsdelete().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"id\":").append("\"").append(id).append("\",");
        sb.append("\"context\":").append("\"").append(context).append("\",");
        sb.append("\"userid\":").append("\"").append(userid).append("\",");
        sb.append("\"sendid\":").append("\"").append(sendid).append("\",");
        sb.append("\"yeslook\":").append("\"").append(yeslook).append("\",");
        sb.append("\"createtime\":").append("\"").append(createtime).append("\",");
        sb.append("\"isdelete\":").append("\"").append(isdelete).append("\",");
        sb.append("\"serialVersionUID\":").append("\"").append(serialVersionUID).append("\"");
        sb.append("}");
        return sb.toString();
    }
}