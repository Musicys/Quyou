package com.yupi.yupao.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import javax.servlet.ServletContext;
import javax.websocket.server.ServerEndpointConfig;


@Configuration
public class WebSocketConfig extends ServerEndpointConfig.Configurator {

    @Autowired
    private ServletContext servletContext;

    /**
     * 注册 WebSocket 端点
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

    /**
     * 获取 WebSocket 端点实例（支持 Spring Bean 注入）
     */
    @Override
    public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
        WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(servletContext);
        if (context == null) {
            throw new InstantiationException("无法获取 WebApplicationContext");
        }
        return context.getBean(endpointClass);
    }
}