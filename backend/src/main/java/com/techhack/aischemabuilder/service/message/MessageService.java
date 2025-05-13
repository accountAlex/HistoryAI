package com.techhack.aischemabuilder.service.message;

import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.Message;
import com.techhack.aischemabuilder.request.SaveMessageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessageService {

    Page<Message> getAllByChatId(Long chatId, Pageable pageable);

    void saveMessage(SaveMessageRequest request, Chat chat, boolean isUser);

    void saveMessage(SaveMessageRequest request, Chat chat, boolean isUser, String messageType);

    Page<Message> getTextPage(Long chatId, Pageable pageable);

    Page<Message> getImagePage(Long chatId, Pageable pageable);
}
