package com.example.AuthLinsoft.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/**
 * This class represents the CORS (Cross-Origin Resource Sharing) configuration for the application.
 * It allows defining global CORS configuration for HTTP requests.
 */
@Configuration
public class CorsConfiguration {
    // Constants for HTTP methods
    private static final String GET = "GET";
    private static final String POST = "POST";
    private static final String PUT = "PUT";
    private static final String DELETE = "DELETE";

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Allow cross-origin requests from any origin for specified HTTP methods
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods(GET, POST, PUT, DELETE)
                        .allowedHeaders("*")// Allow any headers
                        .allowedOriginPatterns("*")// Allow requests from any origin
                        .allowCredentials(true); // Allow sending of cookies with the request
            }

        };
    }
}