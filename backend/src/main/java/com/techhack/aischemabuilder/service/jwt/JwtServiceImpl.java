package com.techhack.aischemabuilder.service.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {

    private final KeyPair keyPair;

    @Autowired
    public JwtServiceImpl(KeyPair keyPair) {
        this.keyPair = keyPair;
    }

    @Override
    @NonNull
    public String generateToken(@NonNull String email) {
        return Jwts
            .builder()
            .setSubject(email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400 * 1000))
            .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
            .compact();
    }

    @Override
    @NonNull
    public Boolean validateToken(@NonNull String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Claims parseToken(@NonNull String token) {
        return (Claims) Jwts
            .parserBuilder()
            .setSigningKey(keyPair.getPublic())
            .build()
            .parse(token)
            .getBody();
    }

}

