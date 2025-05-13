package com.techhack.aischemabuilder.kafka.response;

import java.io.Serializable;

public class LlmResponse implements Serializable {

    private String chatUuid;

    private String content;

    public LlmResponse() {
    }

    public LlmResponse(String chatUuid, String content) {
        this.chatUuid = chatUuid;
        this.content = content;
    }

    public String getChatUuid() {
        return chatUuid;
    }

    public String getContent() {
        return content;
    }
}
