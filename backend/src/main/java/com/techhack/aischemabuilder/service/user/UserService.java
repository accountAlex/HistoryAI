package com.techhack.aischemabuilder.service.user;

import com.techhack.aischemabuilder.entity.User;
import com.techhack.aischemabuilder.request.RegistrationRequest;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;

public interface UserService {

    @NonNull
    User getByEmail(@NonNull String email);

    boolean existsByEmail(@NonNull String email);

    User getById(@NonNull Long id);

    @NonNull
    User create(@NonNull RegistrationRequest request);

    @NonNull
    Authentication setUserAuthentication(@NonNull User user);
}
