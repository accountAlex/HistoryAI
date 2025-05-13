package com.techhack.aischemabuilder.model;

import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

public class ChatModel extends RepresentationModel<ChatModel> {

    private String uuid;

    private LocalDateTime createdAt;

    public String getUuid() {
        return uuid;
    }

    public ChatModel setUuid(String uuid) {
        this.uuid = uuid;
        return this;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public ChatModel setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }
}
