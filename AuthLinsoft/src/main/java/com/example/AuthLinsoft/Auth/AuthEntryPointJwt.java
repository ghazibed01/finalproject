package com.example.AuthLinsoft.Auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
/**
 * This class represents the authentication entry point for handling unauthorized access.
 * It implements Spring Security's AuthenticationEntryPoint interface.
 */
@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    // Logger for logging unauthorized access errors
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        // Log the unauthorized error
        logger.error("Unauthorized error: {}", authException.getMessage());
        // Send an HTTP response with the unauthorized error status code
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
    }
}