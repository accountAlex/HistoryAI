package com.techhack.aischemabuilder.service.message;

import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.Message;
import com.techhack.aischemabuilder.event.MessageSavedEvent;
import com.techhack.aischemabuilder.repository.MessageRepository;
import com.techhack.aischemabuilder.request.SaveMessageRequest;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public MessageServiceImpl(
        MessageRepository messageRepository,
        ApplicationEventPublisher eventPublisher
    ) {
        this.messageRepository = messageRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public Page<Message> getAllByChatId(Long chatId, Pageable pageable) {
        return messageRepository.findAllByChatId(chatId, pageable);
    }

    @Override
    @Transactional
    public void saveMessage(
        SaveMessageRequest request,
        Chat chat,
        boolean isUser
    ) {
        Message message = new Message();

        message.setChat(chat)
            .setChatId(chat.getId())
            .setContent(request.getContent())
            .setIsUser(isUser)
            .setSendAt(LocalDateTime.now()
                .withNano(0)
                .withSecond(0)
            );

        messageRepository.save(message);

        if (isUser) {
            eventPublisher.publishEvent(
                new MessageSavedEvent(this, chat, request.getContent())
            );
        }
    }

}
