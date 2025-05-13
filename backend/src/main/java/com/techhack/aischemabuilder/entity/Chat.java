package com.techhack.aischemabuilder.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, updatable = false, insertable = false)
    private User user;

    @Column(name = "user_id")
    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public Chat setUuid(String uuid) {
        this.uuid = uuid;
        return this;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Chat setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public User getUser() {
        return user;
    }

    public Chat setUser(User user) {
        this.user = user;
        return this;
    }

    public Long getUserId() {
        return userId;
    }

    public Chat setUserId(Long userId) {
        this.userId = userId;
        return this;
    }
}
