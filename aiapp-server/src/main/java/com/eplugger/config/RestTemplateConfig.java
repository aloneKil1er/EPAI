package com.eplugger.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * @author jishuangjiang
 * @date 2025/3/24 9:56:51
 */
@Configuration
public class RestTemplateConfig {
    /**
     * 创建RestTemplate实例
     *
     * @return RestTemplate实例
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}