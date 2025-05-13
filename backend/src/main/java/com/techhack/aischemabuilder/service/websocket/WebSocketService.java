package com.techhack.aischemabuilder.service.websocket;

public interface WebSocketService {

    void sendLLMResponse(String chatUuid, String message);
}
