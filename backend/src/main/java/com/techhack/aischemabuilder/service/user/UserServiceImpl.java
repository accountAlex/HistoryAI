package com.techhack.aischemabuilder.service.user;

import com.techhack.aischemabuilder.entity.User;
import com.techhack.aischemabuilder.repository.UserRepository;
import com.techhack.aischemabuilder.request.RegistrationRequest;
import com.techhack.aischemabuilder.service.details.UserDetailsServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public UserServiceImpl(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        UserDetailsServiceImpl userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
    }

    @Override
    @NonNull
    public User getByEmail(@NonNull String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    public boolean existsByEmail(@NonNull String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @NonNull
    public User getById(@NonNull Long id) {
        return userRepository.findById(id)
            .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    @NonNull
    public User create(@NonNull RegistrationRequest request) {
        User user = new User()
            .setEmail(request.getEmail())
            .setUuid(UUID.randomUUID().toString())
            .setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    @Override
    @NonNull
    public Authentication setUserAuthentication(@NonNull User user) {

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Authentication auth = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        return auth;
    }

}
