package com.techhack.aischemabuilder.service.parse;


import com.techhack.aischemabuilder.response.ArticleResponse;
import com.techhack.aischemabuilder.response.BiographyResponse;
import com.techhack.aischemabuilder.response.HistoryResponse;
import com.techhack.aischemabuilder.response.section.ArticleSection;
import com.techhack.aischemabuilder.response.section.BiographySection;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ParseServiceImpl implements ParseService {

    private static final Log log = LogFactory.getLog(ParseServiceImpl.class);

    public List<HistoryResponse> fetch(int limit, String url) {
        List<HistoryResponse> result = new ArrayList<>();
        int page = 1;

        try {
            while (result.size() < limit) {
                String buildUrl = url + "?page=" + page;
                Document doc = Jsoup.connect(buildUrl)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();

                Elements cards = doc.select("div.-m-2\\.5.flex.flex-wrap a.group[href]");
                if (cards.isEmpty()) break;

                for (Element card : cards) {
                    String title = card.text();
                    String href = card.absUrl("href");

                    Element img = card.selectFirst("img");
                    String imageUrl = "";
                    if (img != null) {
                        String dataSrc = img.attr("data-src");
                        if (!dataSrc.isBlank()) {
                            imageUrl = img.absUrl("data-src");
                        } else {
                            imageUrl = img.absUrl("src");
                        }
                    }
                    HistoryResponse response = new HistoryResponse();
                    response.setTitle(title)
                        .setImageUrl(imageUrl)
                        .setUrl(href);

                    result.add(response);
                    if (result.size() >= limit) break;
                }
                page++;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return result;
    }

    @Override
    public BiographyResponse fetchBiographyContent(String url) {
        try {
            Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .timeout(10_000)
                .get();

            Element bioHeaderDiv = doc.selectFirst("div.col-span-full");
            assert bioHeaderDiv != null;

            String title = Objects.requireNonNull(bioHeaderDiv.selectFirst("h1")).text();
            String titlePhoto = "https://histrf.ru" +
                Objects.requireNonNull(bioHeaderDiv.selectFirst("img.general-preview-image")).attr("data-src");

            Element pageBody = doc.selectFirst("div.page-body");

            List<BiographySection> sectionList = new ArrayList<>();
            if (pageBody != null) {
                Elements children = pageBody.children();

                BiographySection currentSection = null;

                for (Element child : children) {
                    if (child.tagName().equals("h2")) {
                        if (currentSection != null) {
                            sectionList.add(currentSection);
                        }
                        currentSection = new BiographySection()
                            .setHeading(child.text())
                            .setContent(new StringBuilder());
                    } else if (currentSection != null) {
                        currentSection.getContent().append(child.outerHtml());
                    }
                }

                if (currentSection != null) {
                    sectionList.add(currentSection);
                }
            }

            return new BiographyResponse()
                .setTitle(title)
                .setTitlePhoto(titlePhoto)
                .setSections(sectionList);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ArticleResponse fetchArticleContent(String url, String img) {
        try {
            Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0")
                .timeout(10_000)
                .get();

            Element mainDiv = doc.selectFirst("div.hstrf-editor");

            List<ArticleSection> sections = new ArrayList<>();
            ArticleResponse articleResponse = new ArticleResponse();
            if (mainDiv != null) {
                String title = Objects.requireNonNull(mainDiv.selectFirst("h1")).text();
                Elements paragraphs = mainDiv.select("p");

                for (Element p : paragraphs) {
                    String html = p.outerHtml();
                    if (!html.trim().isEmpty()) {
                        ArticleSection section = new ArticleSection()
                            .setContent(html);
                        sections.add(section);
                    }
                }

                articleResponse.setTitle(title)
                    .setTitlePhoto(img)
                    .setSections(sections);
            }

            return articleResponse;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
