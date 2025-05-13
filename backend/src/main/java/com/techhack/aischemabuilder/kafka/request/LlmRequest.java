package com.techhack.aischemabuilder.kafka.request;

import java.io.Serializable;

public class LlmRequest implements Serializable {

    private String chatUuid;
    private String content;

    public LlmRequest() {
    }

    public LlmRequest(String chatUuid, String content) {
        this.chatUuid = chatUuid;
        this.content = content;
    }

    public String getChatUuid() {
        return chatUuid;
    }

    public void setChatUuid(String chatUuid) {
        this.chatUuid = chatUuid;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "LlmRequest{" +
            "chatUuid='" + chatUuid + '\'' +
            ", content='" + content + '\'' +
            '}';
    }

}
