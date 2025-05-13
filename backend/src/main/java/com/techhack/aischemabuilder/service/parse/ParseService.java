package com.parsertest.service.parse;

import com.parsertest.response.ArticleResponse;
import com.parsertest.response.BiographyResponse;
import com.parsertest.response.HistoryResponse;

import java.io.IOException;
import java.util.List;

public interface ParseService {

    List<HistoryResponse> fetch(int limit, String url) throws IOException;

    BiographyResponse fetchBiographyContent(String url);

    ArticleResponse fetchArticleContent(String url, String img);
}
