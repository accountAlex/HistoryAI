package com.techhack.aischemabuilder.controller;

import com.techhack.aischemabuilder.entity.User;
import com.techhack.aischemabuilder.handler.JwtAuthenticationSuccessHandler;
import com.techhack.aischemabuilder.request.RegistrationRequest;
import com.techhack.aischemabuilder.service.details.UserDetailsServiceImpl;
import com.techhack.aischemabuilder.service.user.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("api/registration")
public class RegistrationController {

    private final UserService userService;

    private final JwtAuthenticationSuccessHandler successHandler;

    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public RegistrationController(
        UserService userService,
        JwtAuthenticationSuccessHandler successHandler,
        UserDetailsServiceImpl userDetailsService
    ) {
        this.userService = userService;
        this.successHandler = successHandler;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping
    public void register(
        @RequestBody RegistrationRequest registrationRequest,
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        User user = userService.create(registrationRequest);

        Authentication auth = userService.setUserAuthentication(user);

        successHandler.onAuthenticationSuccess(request, response, auth);
    }

}
