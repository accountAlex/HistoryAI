package com.techhack.aischemabuilder.controller;

import com.techhack.aischemabuilder.constant.UrlConstant;
import com.techhack.aischemabuilder.response.ArticleResponse;
import com.techhack.aischemabuilder.response.BiographyResponse;
import com.techhack.aischemabuilder.response.HistoryResponse;
import com.techhack.aischemabuilder.service.parse.ParseService;
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
