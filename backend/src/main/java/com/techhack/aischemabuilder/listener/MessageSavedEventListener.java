package com.techhack.aischemabuilder.listener;

import com.techhack.aischemabuilder.event.MessageSavedEvent;
import com.techhack.aischemabuilder.request.CreateSchemaRequest;
import com.techhack.aischemabuilder.service.llm.LlmServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MessageSavedEventListener {

    private final LlmServiceImpl llmService;

    @Autowired
    public MessageSavedEventListener(LlmServiceImpl llmService) {
        this.llmService = llmService;
    }

    @EventListener
    public void onMessageSaved(MessageSavedEvent event) {
//        llmService.handleChatMessage(event.getChat(), event.getContent());
    }
}
