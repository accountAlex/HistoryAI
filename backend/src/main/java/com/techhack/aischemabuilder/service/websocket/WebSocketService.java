package com.techhack.aischemabuilder.service.websocket;

import java.util.List;

public interface WebSocketService {

    void sendLLMResponse(String chatUuid, String message);

    void sendLLMTextResponse(String chatUuid, String message);

    void sendLLMPhotoResponse(String chatUuid, String photoUrl);
}
