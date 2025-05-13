package com.techhack.aischemabuilder.service.llm;

import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.request.CreateSchemaRequest;
import okhttp3.Request;

public interface LlmService {

    Request createRequest(String userPrompt);

    String getResponse(CreateSchemaRequest schemaRequest);

    void createSchema(CreateSchemaRequest schemaRequest);

    void handleChatMessage(Chat chat, String userContent);
}
