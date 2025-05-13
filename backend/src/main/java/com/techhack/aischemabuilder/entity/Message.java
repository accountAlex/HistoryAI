package com.techhack.aischemabuilder.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime sendAt;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column
    private String content;

    private boolean isUser;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private Chat chat;

    @Column(name = "chat_id")
    private Long chatId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSendAt() {
        return sendAt;
    }

    public Message setSendAt(LocalDateTime sendAt) {
        this.sendAt = sendAt;
        return this;
    }

    public String getContent() {
        return content;
    }

    public Message setContent(String content) {
        this.content = content;
        return this;
    }

    public boolean isUser() {
        return isUser;
    }

    public Message setIsUser(boolean isUser) {
        this.isUser = isUser;
        return this;
    }

    public Chat getChat() {
        return chat;
    }

    public Message setChat(Chat chat) {
        this.chat = chat;
        return this;
    }

    public Long getChatId() {
        return chatId;
    }

    public Message setChatId(Long chatId) {
        this.chatId = chatId;
        return this;
    }
}
