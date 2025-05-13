package com.techhack.aischemabuilder.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techhack.aischemabuilder.response.LoginResponse;
import com.techhack.aischemabuilder.service.jwt.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;

    private final JwtService jwtService;

    @Autowired
    public JwtAuthenticationSuccessHandler(
        ObjectMapper objectMapper,
        JwtService jwtService
    ) {
        this.objectMapper = objectMapper;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        String token = jwtService.generateToken(authentication.getName());
        response.addHeader("Authorization", "Bearer " + token);

        LoginResponse loginResponse = new LoginResponse(true);

        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
        response.getWriter().flush();
    }

}
