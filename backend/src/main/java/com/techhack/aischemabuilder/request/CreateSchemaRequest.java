package com.techhack.aischemabuilder.request;

public class CreateSchemaRequest {

    private String content;

    private String chatUuid;

    public String getContent() {
        return content;
    }

    public CreateSchemaRequest setContent(String content) {
        this.content = content;
        return this;
    }

    public String getChatUuid() {
        return chatUuid;
    }

    public CreateSchemaRequest setChatUuid(String chatUuid) {
        this.chatUuid = chatUuid;
        return this;
    }
}
