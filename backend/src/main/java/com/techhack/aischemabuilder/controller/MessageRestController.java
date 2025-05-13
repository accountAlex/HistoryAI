package com.techhack.aischemabuilder.controller;

import com.techhack.aischemabuilder.assembler.MessageModelAssembler;
import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.Message;
import com.techhack.aischemabuilder.kafka.service.KafkaSenderService;
import com.techhack.aischemabuilder.model.MessageModel;
import com.techhack.aischemabuilder.request.SaveMessageRequest;
import com.techhack.aischemabuilder.service.chat.ChatService;
import com.techhack.aischemabuilder.service.message.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageRestController {

    private final ChatService chatService;

    private final MessageService messageService;

    private final MessageModelAssembler messageModelAssembler;

    private final KafkaSenderService kafkaSenderService;

    @Autowired
    public MessageRestController(
        ChatService chatService,
        MessageService messageService,
        MessageModelAssembler messageModelAssembler,
        KafkaSenderService kafkaSenderService
    ) {
        this.chatService = chatService;
        this.messageService = messageService;
        this.messageModelAssembler = messageModelAssembler;
        this.kafkaSenderService = kafkaSenderService;
    }

    @GetMapping
    public PagedModel<MessageModel> getChatMessages(
        @RequestParam String uuid,
        @PageableDefault(sort = "sendAt", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Chat chat = chatService.getChatByUuid(uuid);
        Page<Message> messagePage = messageService.getAllByChatId(chat.getId(), pageable);

        return messageModelAssembler.toPagedModel(messagePage);
    }

    @PostMapping
    public HttpStatus saveMessage(
        @RequestBody SaveMessageRequest request
    ) {
        Chat chat = chatService.getChatByUuid(request.getUuid());
        messageService.saveMessage(request, chat, true);
        kafkaSenderService.sendMessage(request.getUuid(), request.getContent());
        return HttpStatus.OK;
    }
}
