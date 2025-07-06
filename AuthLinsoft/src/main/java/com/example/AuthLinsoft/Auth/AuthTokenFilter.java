package com.example.AuthLinsoft.Auth;

import com.example.AuthLinsoft.Services.User.UserDetailsServiceImpl;
import com.example.AuthLinsoft.Utils.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This class represents a filter that intercepts incoming requests to authenticate users using JWT tokens.
 * It extends Spring's OncePerRequestFilter class.
 */
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    // Logger for logging authentication related information
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Extract JWT token from the request
            String jwt = parseJwt(request);
            // Validate the JWT token
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // Extract username from the JWT token
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                // Load user details from the database based on the username
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                // Create an authentication token with user details and set it in the security context
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails,
                                null,
                                userDetails.getAuthorities());
                // Set additional details for authentication
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Set the authentication token in the security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Log any errors occurred during authentication
            logger.error("Cannot set user authentication: {}", e);
        }
        // Continue the filter chain for further processing
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        // Extract JWT token from the request (e.g., from cookies)
        String jwt = jwtUtils.getJwtFromCookies(request);
        return jwt;
    }
}