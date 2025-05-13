package com.parsertest.controller;

import com.parsertest.constant.UrlConstant;
import com.parsertest.response.ArticleResponse;
import com.parsertest.response.BiographyResponse;
import com.parsertest.response.HistoryResponse;
import com.parsertest.service.parse.ParseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class HistoryController {

    private final ParseService parseService;

    @Autowired
    public HistoryController(ParseService parseService) {
        this.parseService = parseService;
    }

    @GetMapping("/articles")
    public List<HistoryResponse> getArticles(
        @RequestParam(name = "limit", defaultValue = "20") int limit
    ) throws IOException {
        return parseService.fetch(limit, UrlConstant.ARTICLES);
    }

    @GetMapping("/biographies")
    public List<HistoryResponse> getBiographies(
        @RequestParam(name = "limit", defaultValue = "20") int limit
    ) throws IOException {
        return parseService.fetch(limit, UrlConstant.BIOGRAPHIES);
    }

    @GetMapping("/articles/get")
    public ArticleResponse getArticle(
        @RequestParam(name = "url") String url,
        @RequestParam(name = "img") String img
    ) {
        return parseService.fetchArticleContent(url, img);
    }

    @GetMapping("/biographies/get")
    public BiographyResponse getBiographies(
        @RequestParam(name = "url") String url
    ) {
        return parseService.fetchBiographyContent(url);
    }
}
