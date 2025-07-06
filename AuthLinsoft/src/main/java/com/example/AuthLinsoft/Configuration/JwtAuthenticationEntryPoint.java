package com.example.AuthLinsoft.Configuration;


import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
/**
 * This class represents the entry point for handling JWT authentication errors.
 * It implements Spring Security's AuthenticationEntryPoint interface.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // Send an HTTP response with the unauthorized status code and message
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }

}