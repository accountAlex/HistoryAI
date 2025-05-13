package com.techhack.aischemabuilder.event;

import com.techhack.aischemabuilder.entity.Chat;
import org.springframework.context.ApplicationEvent;

public class MessageSavedEvent extends ApplicationEvent {

    private final Chat chat;

    private final String content;

    public MessageSavedEvent(
        Object source,
        Chat chat,
        String content
    ) {
        super(source);
        this.chat = chat;
        this.content = content;
    }

    public Chat getChat() {
        return chat;
    }

    public String getContent() {
        return content;
    }
}
