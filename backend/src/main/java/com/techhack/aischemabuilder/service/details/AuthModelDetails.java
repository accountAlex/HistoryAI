package com.techhack.aischemabuilder.service.details;

import com.techhack.aischemabuilder.entity.User;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

public class AuthModelDetails extends org.springframework.security.core.userdetails.User {

    private final Long id;

    private final String uuid;

    public static AuthModelDetails of(@NonNull User user) {
        return new AuthModelDetails(
            user.getId(),
            user.getUuid(),
            user.getEmail(),
            user.getPassword()
        );
    }

    private AuthModelDetails(
        @NonNull Long id,
        @NonNull String uuid,
        @NonNull String email,
        @Nullable String password
    ) {
        super(email, password, Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
        this.id = id;
        this.uuid = uuid;
    }

}