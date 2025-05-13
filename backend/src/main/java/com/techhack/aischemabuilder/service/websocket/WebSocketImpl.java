package com.techhack.aischemabuilder.service.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketImpl implements WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void sendLLMResponse(String chatUuid, String message) {
        System.out.println("/topic/chat/" + chatUuid + "/llmResponses");
        messagingTemplate.convertAndSend(
            "/topic/chat/" + chatUuid + "/llmResponses",
            message
        );
    }

    @Override
    public void sendLLMTextResponse(String chatUuid, String message) {
        System.out.println("/topic/chat/" + chatUuid + "/llmResponses");
        messagingTemplate.convertAndSend(
            "/topic/chat/" + chatUuid + "/llmResponses",
            message
        );
    }

    @Override
    public void sendLLMPhotoResponse(String chatUuid, String photoUrl) {
        System.out.println("/topic/chat/" + chatUuid + "/llmPhotoResponses");
        messagingTemplate.convertAndSend(
            "/topic/chat/" + chatUuid + "/llmPhotoResponses",
            photoUrl
        );
    }
}
