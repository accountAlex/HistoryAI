package com.techhack.aischemabuilder.service.chat;

import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.User;
import com.techhack.aischemabuilder.repository.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;

    @Autowired
    public ChatServiceImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Override
    public Chat getByUserId(Long userId) {
        return chatRepository.findByUserId(userId)
            .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    public Chat getChatByUuid(String uuid) {
        return chatRepository.findByUuid(uuid)
            .orElseThrow(EntityNotFoundException::new);
    }

    @Override
    public boolean existsByUserId(Long userId) {
        return chatRepository.existsByUserId(userId);
    }

    @Override
    public Chat create(User authUser) {
        Chat chat = new Chat();

        chat.setUser(authUser)
            .setCreatedAt(
                LocalDateTime.now()
                    .withNano(0)
                    .withSecond(0)
            )
            .setUserId(authUser.getId())
            .setUuid(UUID.randomUUID().toString());

        chatRepository.save(chat);

        return chat;
    }

    @Override
    public Page<Chat> getAllByUserId(Long userId, Pageable pageable) {
        return chatRepository.findAllByUserId(userId, pageable);
    }
}
