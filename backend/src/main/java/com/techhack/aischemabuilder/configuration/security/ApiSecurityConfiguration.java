package com.techhack.aischemabuilder.configuration.security;

import com.techhack.aischemabuilder.filter.JwtAuthenticationFilter;
import com.techhack.aischemabuilder.handler.JwtAuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class ApiSecurityConfiguration {

    private final static String LOGIN_PATTERN = "/api/login";

    private final static String REGISTRATION_PATTERN = "/api/registration";

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final JwtAuthenticationSuccessHandler successHandler;

    @Autowired
    public ApiSecurityConfiguration(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        JwtAuthenticationSuccessHandler successHandler
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.successHandler = successHandler;
    }

    @Bean("apiFilterChain")
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(req ->
                req
                    .requestMatchers(LOGIN_PATTERN, REGISTRATION_PATTERN, "/ws/**")
                    .permitAll()
                    .requestMatchers("/login")
                    .denyAll()
                    .anyRequest()
                    .authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http
            .csrf(AbstractHttpConfigurer::disable);

        http
            .formLogin(form ->
                form
                    .loginProcessingUrl(LOGIN_PATTERN)
                    .usernameParameter("email")
                    .passwordParameter("password")
                    .successHandler(successHandler)
            );

        http
            .sessionManagement(session ->
                session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept", "X-Requested-With",
            "X-CSRF-Token", "Access-Control-Allow-Origin"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
