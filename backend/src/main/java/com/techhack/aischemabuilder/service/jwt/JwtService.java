package com.techhack.aischemabuilder.service.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.lang.NonNull;

public interface JwtService {

    @NonNull
    String generateToken(@NonNull String email);

    @NonNull
    Boolean validateToken(@NonNull String token);

    Claims parseToken(@NonNull String token);

}
