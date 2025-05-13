package com.techhack.aischemabuilder.service.chat;

import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChatService {

    Chat getByUserId(Long userId);

    Chat getChatByUuid(String uuid);

    boolean existsByUserId(Long userId);

    Chat create(User authUser);

    Page<Chat> getAllByUserId(Long userId, Pageable pageable);
}
