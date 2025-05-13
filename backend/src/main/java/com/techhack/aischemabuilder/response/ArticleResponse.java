package com.techhack.aischemabuilder.response;

import com.techhack.aischemabuilder.response.section.ArticleSection;

import java.util.List;

public class ArticleResponse {
    private String title;

    private String titlePhoto;

    private List<ArticleSection> sections;

    public String getTitle() {
        return title;
    }

    public ArticleResponse setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getTitlePhoto() {
        return titlePhoto;
    }

    public ArticleResponse setTitlePhoto(String titlePhoto) {
        this.titlePhoto = titlePhoto;
        return this;
    }

    public List<ArticleSection> getSections() {
        return sections;
    }

    public ArticleResponse setSections(List<ArticleSection> sections) {
        this.sections = sections;
        return this;
    }
}
