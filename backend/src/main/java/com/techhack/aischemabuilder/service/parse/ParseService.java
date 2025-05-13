package com.techhack.aischemabuilder.service.parse;


import com.techhack.aischemabuilder.response.ArticleResponse;
import com.techhack.aischemabuilder.response.BiographyResponse;
import com.techhack.aischemabuilder.response.HistoryResponse;

import java.io.IOException;
import java.util.List;

public interface ParseService {

    List<HistoryResponse> fetch(int limit, String url) throws IOException;

    BiographyResponse fetchBiographyContent(String url);

    ArticleResponse fetchArticleContent(String url, String img);
}
