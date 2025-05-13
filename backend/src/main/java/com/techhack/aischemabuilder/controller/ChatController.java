package com.techhack.aischemabuilder.controller;

import com.techhack.aischemabuilder.model.ChatModel;
import com.techhack.aischemabuilder.assembler.ChatModelAssembler;
import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.User;
import com.techhack.aischemabuilder.service.chat.ChatService;
import com.techhack.aischemabuilder.service.details.AuthModelDetails;
import com.techhack.aischemabuilder.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.PagedModel;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chats")
public class ChatController {

    private final ChatService chatService;

    private final UserService userService;

    private final ChatModelAssembler chatModelAssembler;

    @Autowired
    public ChatController(
        ChatService chatService,
        UserService userService,
        ChatModelAssembler chatModelAssembler
    ) {
        this.chatService = chatService;
        this.userService = userService;
        this.chatModelAssembler = chatModelAssembler;
    }

    @PostMapping
    public ChatModel createChat(@AuthenticationPrincipal AuthModelDetails authModelDetails) {
        User authUser = userService.getByEmail(authModelDetails.getUsername());
        Chat chat = chatService.create(authUser);

        return chatModelAssembler.toModel(chat);
    }

    @GetMapping("/{uuid}")
    public ChatModel getChat(@PathVariable String uuid) {
        Chat chat = chatService.getChatByUuid(uuid);

        return chatModelAssembler.toModel(chat);
    }

    @GetMapping
    public PagedModel<ChatModel> getChats(
        @AuthenticationPrincipal AuthModelDetails authModelDetails,
        @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        User authUser = userService.getByEmail(authModelDetails.getUsername());
        Page<Chat> chatPage = chatService.getAllByUserId(authUser.getId(), pageable);

        return chatModelAssembler.toPagedModel(chatPage);
    }
}
