package com.techhack.aischemabuilder.controller;

import com.techhack.aischemabuilder.request.CreateSchemaRequest;
import com.techhack.aischemabuilder.service.llm.LlmServiceImpl;
import com.techhack.aischemabuilder.util.SchemaExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/schemas")
public class LlmRestController {

    private final LlmServiceImpl llmServiceImpl;

    @Autowired
    public LlmRestController(LlmServiceImpl llmServiceImpl) {
        this.llmServiceImpl = llmServiceImpl;
    }

    @GetMapping
    public String response(@RequestBody CreateSchemaRequest request) throws Exception {
        return SchemaExtractor.extractSchema(
            llmServiceImpl.getResponse(request)
        );
    }

    @PostMapping
    public String create(@RequestBody CreateSchemaRequest request) {
        llmServiceImpl.createSchema(request);

        return "Заявка принята. Ожидайте ответа.";
    }
}
