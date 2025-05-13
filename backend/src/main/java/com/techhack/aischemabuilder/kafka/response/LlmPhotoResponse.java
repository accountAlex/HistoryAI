package com.techhack.aischemabuilder.kafka.response;

import java.util.List;

public class LlmPhotoResponse {

    private String chatUuid;

    private List<String> urls;

    public LlmPhotoResponse() {}

    public LlmPhotoResponse(String chatUuid, List<String> urls) {
        this.chatUuid = chatUuid;
        this.urls = urls;
    }

    public String getChatUuid() {
        return chatUuid;
    }

    public LlmPhotoResponse setChatUuid(String chatUuid) {
        this.chatUuid = chatUuid;
        return this;
    }

    public List<String> getUrls() {
        return urls;
    }

    public LlmPhotoResponse setUrls(List<String> urls) {
        this.urls = urls;
        return this;
    }
}
