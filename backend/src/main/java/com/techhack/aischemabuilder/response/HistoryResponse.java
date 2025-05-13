package com.parsertest.response;

public class HistoryResponse {

    private String title;

    private String url;

    private String imageUrl;

    public String getTitle() {
        return title;
    }

    public HistoryResponse setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getUrl() {
        return url;
    }

    public HistoryResponse setUrl(String url) {
        this.url = url;
        return this;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public HistoryResponse setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }
}
