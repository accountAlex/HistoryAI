package com.techhack.aischemabuilder.repository;

import com.techhack.aischemabuilder.entity.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, String> {

    Optional<Chat> findByUserId(Long userId);

    Optional<Chat> findByUuid(String uuid);

    boolean existsByUserId(Long userId);

    Page<Chat> findAllByUserId(Long userId, Pageable pageable);
}
