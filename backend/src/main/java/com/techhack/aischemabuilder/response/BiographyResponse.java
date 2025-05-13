package com.techhack.aischemabuilder.response;

import com.techhack.aischemabuilder.response.section.BiographySection;

import java.util.List;

public class BiographyResponse {

    private String title;

    private String titlePhoto;

    private List<BiographySection> sections;

    public String getTitle() {
        return title;
    }

    public BiographyResponse setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getTitlePhoto() {
        return titlePhoto;
    }

    public BiographyResponse setTitlePhoto(String titlePhoto) {
        this.titlePhoto = titlePhoto;
        return this;
    }

    public List<BiographySection> getSections() {
        return sections;
    }

    public BiographyResponse setSections(List<BiographySection> sections) {
        this.sections = sections;
        return this;
    }
}
