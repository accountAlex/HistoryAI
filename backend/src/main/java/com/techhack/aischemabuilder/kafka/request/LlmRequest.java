package com.techhack.aischemabuilder.kafka.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class LlmRequest implements Serializable {

    private String chatUuid;
    private String content;


    @JsonProperty("needImages")
    private Boolean needImages;

    public LlmRequest() {
    }

    public LlmRequest(String chatUuid, String content) {
        this.chatUuid = chatUuid;
        this.content = content;
    }

    public LlmRequest(String chatUuid, String message, Boolean needImages) {
        this.chatUuid = chatUuid;
        this.content = message;
        this.needImages = needImages;
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

    public Boolean getNeedImages() {
        return needImages;
    }

    public LlmRequest setNeedImages(Boolean needImages) {
        this.needImages = needImages;
        return this;
    }

    @Override
    public String toString() {
        return "LlmRequest{" +
            "chatUuid='" + chatUuid + '\'' +
            ", content='" + content + '\'' +
            '}';
    }

}
