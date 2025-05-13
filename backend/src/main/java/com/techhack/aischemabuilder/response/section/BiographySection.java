package com.techhack.aischemabuilder.response.section;

public class BiographySection {

    private String heading;

    private StringBuilder content;

    public String getHeading() {
        return heading;
    }

    public BiographySection setHeading(String heading) {
        this.heading = heading;
        return this;
    }

    public StringBuilder getContent() {
        return content;
    }

    public BiographySection setContent(StringBuilder content) {
        this.content = content;
        return this;
    }
}
