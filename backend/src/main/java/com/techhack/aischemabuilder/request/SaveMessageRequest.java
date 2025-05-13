package com.techhack.aischemabuilder.request;

public class SaveMessageRequest {

    private String uuid;

    private String content;

    private Boolean needImages;

    public String getUuid() {
        return uuid;
    }

    public SaveMessageRequest setUuid(String uuid) {
        this.uuid = uuid;
        return this;
    }

    public String getContent() {
        return content;
    }

    public SaveMessageRequest setContent(String content) {
        this.content = content;
        return this;
    }

    public Boolean getNeedImages() {
        return needImages;
    }

    public SaveMessageRequest setNeedImages(Boolean needImages) {
        this.needImages = needImages;
        return this;
    }
}
