package com.techhack.aischemabuilder.repository;

import com.techhack.aischemabuilder.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findAllByChatId(Long chatId, Pageable pageable);

    // Текст
    Page<Message> findAllByChatIdAndMessageType(
        Long chatId,
        String messageType,
        Pageable pageable
    );

    // Изображения
    Page<Message> findAllByChatIdAndMessageTypeOrderBySendAt(
        Long chatId,
        String messageType,
        Pageable pageable
    );
}
