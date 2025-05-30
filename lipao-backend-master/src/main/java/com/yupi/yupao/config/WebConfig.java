package com.yupi.yupao.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://192.168.220.1") // 替换为你的前端域名或 IP 地址
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true); // 允许携带 Cookie
    }
}