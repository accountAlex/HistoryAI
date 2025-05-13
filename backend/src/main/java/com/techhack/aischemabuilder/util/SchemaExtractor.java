package com.techhack.aischemabuilder.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SchemaExtractor {

    public static String extractSchema(String jsonResponse) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        JsonNode root = mapper.readTree(jsonResponse);

        JsonNode contentNode = root
            .path("choices")
            .get(0)
            .path("message")
            .path("content");

        if (contentNode.isMissingNode()) {
            throw new IllegalArgumentException("Не найдено поле message.content");
        }

        return contentNode.asText();
    }
}
