package com.techhack.aischemabuilder.model;

import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

public class MessageModel extends RepresentationModel<MessageModel> {

    private String content;

    private boolean isUser;

    private LocalDateTime sendAt;

    private String chatUuid;

    public String getContent() {
        return content;
    }

    public MessageModel setContent(String content) {
        this.content = content;
        return this;
    }

    public boolean isUser() {
        return isUser;
    }

    public MessageModel setIsUser(boolean user) {
        isUser = user;
        return this;
    }

    public LocalDateTime getSendAt() {
        return sendAt;
    }

    public MessageModel setSendAt(LocalDateTime sendAt) {
        this.sendAt = sendAt;
        return this;
    }

    public String getChatUuid() {
        return chatUuid;
    }

    public MessageModel setChatUuid(String chatUuid) {
        this.chatUuid = chatUuid;
        return this;
    }
}
