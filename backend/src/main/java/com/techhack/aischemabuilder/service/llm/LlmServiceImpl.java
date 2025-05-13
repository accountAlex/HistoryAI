package com.techhack.aischemabuilder.service.llm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.entity.Message;
import com.techhack.aischemabuilder.model.MessageModel;
import com.techhack.aischemabuilder.request.CreateSchemaRequest;
import com.techhack.aischemabuilder.request.SaveMessageRequest;
import com.techhack.aischemabuilder.service.message.MessageService;
import com.techhack.aischemabuilder.service.websocket.WebSocketService;
import okhttp3.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class LlmServiceImpl implements LlmService {

    private static final Log log = LogFactory.getLog(LlmServiceImpl.class);

    @Value("${llm.api-url}")
    private String apiUrl;

    @Value("${llm.model}")
    private String model;

    @Value("${llm.token}")
    private String token;

    private static final String INITIAL_PROMT = """
        ты ассистент для генерации альтернативных историй 
        """;

    private final WebSocketService webSocketService;

    private final MessageService messageService;

    private final ObjectMapper objectMapper;

    @Autowired
    public LlmServiceImpl(
        WebSocketService webSocketService,
        MessageService messageService,
        ObjectMapper objectMapper
    ) {
        this.webSocketService = webSocketService;
        this.messageService = messageService;
        this.objectMapper = objectMapper;
    }

    @Override
    public Request createRequest(String userPrompt) {
        String jsonBody = String.format("""
            {
              "model": "%s",
              "messages": [
                {
                  "role": "system",
                  "content": "Ты — AI-ассистент для генерации и редактирования JSON-схем workflow-процессов (WF) интеграционной платформы. Твои задачи:\\n\\n1. **Генерация JSON-схем**\\n- Создавай валидные JSON-схемы по спецификации:\\n```\\n{\\n  \\"type\\": \\"complex|await_for_message|rest_call|db_call|send_to_rabbitmq|send_to_sap|transform\\",\\n  \\"name\\": \\"String255\\",\\n  \\"tenantId?\\": \\"default\\",\\n  \\"version?\\": 1,\\n  \\"description?\\": \\"String4000\\",\\n  \\"compiled\\": {\\n    \\"start\\": \\"activity_id\\",\\n    \\"activities\\": [Activity],\\n    \\"outputTemplate?\\": {}\\n  },\\n  \\"details\\": {\\n    \\"inputValidateSchema?\\": {},\\n    \\"outputValidateSchema?\\": {},\\n    \\"starters\\": [{\\n      \\"type\\": \\"kafka_consumer|sap_inbound|rest_call|scheduler|rabbitmq_consumer|mail_consumer\\",\\n      \\"name\\": \\"String255\\",\\n      \\"description?\\": \\"String255\\",\\n      \\"*Config\\": {} // Конфиг в зависимости от type\\n    }],\\n    \\"*Config\\": {} // Конфиг в зависимости от type WF\\n  },\\n  \\"flowEditorConfig?\\": {}\\n}\\n```\\n- Для type=\\"complex\\" обязательно указывай compiled с activities\\n- Для других типов обязательно details с соответствующим *Config\\n- Стартеры обязательны (хотя бы один)\\n\\n2. **Проверка обязательных полей**\\n- type, name - всегда обязательны\\n- compiled - обязателен для complex\\n- details - обязателен для НЕ-complex\\n- Конкретные *Config обязательны для соответствующих типов\\n\\n3. **Интерактивное редактирование**\\n- Изменяй схему по командам типа: \\"Добавь activity с id='step1' типа 'rest_call'\\"\\n- При изменении типа WF автоматически добавляй соответствующий *Config\\n\\n4. **Контроль ошибок**\\n- Если не хватает обязательных полей - запрашивай: \\"Укажите конфиг для типа 'send_to_kafka'\\"\\n- При ссылке на несуществующий activity: \\"Ошибка: activity 'step5' не найдена\\"\\n\\n5. **Особенности**\\n- tenantId по умолчанию \\"default\\"\\n- version по умолчанию 1\\n- Поддерживай валидность JSON и правильные типы полей\\n\\nОтвечай кратко, вноси изменения точно, запрашивай недостающие данные. Если у тебя нет уточнение на выходе всегда просто отдавай полностью готовую JSON-схему, иначе если ты не уверен то сначала пиши уточнения которые нужны, и после получения информации строй саму схему. Повторю, на выходе ГОТОВАЯ схема, без промежуточных и в случае если у тебя есть уточнения то НИКАКУЮ схему не надо делать, ты сначала получаешь уточнения а потом только СТРОИШЬ схему"
                },
                {
                  "role": "user",
                  "content": "%s"
                }
              ]
            }
            """, model, userPrompt);

        log.info(jsonBody);

        RequestBody body = RequestBody.create(
            jsonBody,
            MediaType.parse("application/json")
        );

        String secretKey = "sk-KNo006G2a48UVE3IxFlQEQ";
        return new Request.Builder()
            .url(apiUrl)
            .post(body)
            .addHeader("Authorization", String.format("Bearer %s", secretKey))
            .addHeader("Accept", "application/json")
            .build();
    }

    @Override
    public String getResponse(CreateSchemaRequest schemaRequest) {
        Request request = createRequest(schemaRequest.getContent());
        OkHttpClient.Builder builder = new OkHttpClient.Builder().readTimeout(60, TimeUnit.SECONDS);
        OkHttpClient client = new OkHttpClient(builder);

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.info("Ошибка: " + response.code());
            }

            return response.body().string();
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при запросе: ", e);
        }
    }

    @Override
    public void createSchema(CreateSchemaRequest schemaRequest) {
        Request request = createRequest(schemaRequest.getContent());
        OkHttpClient client = new OkHttpClient();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.info("Ошибка: " + response.code());
            }

            webSocketService.sendLLMResponse(schemaRequest.getChatUuid(), response.body().string());
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при запросе: ", e);
        }
    }

    @Override
    public void handleChatMessage(Chat chat, String userContent) {
        try {
            // List<Message> history = messageService
            //     .getAllByChatId(chat.getId(), Pageable.unpaged())
            //     .getContent()
            //     .stream()
            //     .sorted(Comparator.comparing(Message::getSendAt))
            //     .toList();

            // List<Map<String, String>> messages = new ArrayList<>();

            // messages.add(Map.of(
            //     "role", "system",
            //     "content", INITIAL_PROMT)
            // );
            // for (Message msg : history) {
            //     messages.add(Map.of(
            //         "role", msg.isUser() ? "user" : "assistant",
            //         "content", msg.getContent())
            //     );
            // }

            // String assistantContent = callLLMApi(messages);
            // assistantContent = assistantContent.replace("*", "");

            // SaveMessageRequest assistantReq = new SaveMessageRequest();
            // assistantReq.setUuid(chat.getUuid());
            // assistantReq.setContent(assistantContent);
            // messageService.saveMessage(assistantReq, chat, false);

            webSocketService.sendLLMResponse(chat.getUuid(), userContent);
        } catch (Exception e) {
            log.error("Ошибка при обработке чата через LLM", e);
        }
    }

    private String callLLMApi(List<Map<String, String>> messages) throws IOException {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("messages", messages);

        String jsonBody = objectMapper.writeValueAsString(body);

        Request request = new Request.Builder()
            .url(apiUrl)
            .addHeader("Authorization", "Bearer " + token)
            .addHeader("Content-Type", "application/json")
            .post(RequestBody.create(jsonBody, MediaType.parse("application/json")))
            .build();

        OkHttpClient.Builder builder = new OkHttpClient.Builder().readTimeout(60, TimeUnit.SECONDS);
        OkHttpClient client = new OkHttpClient(builder);
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.info("Ошибка: " + response.code());
            }

            return objectMapper.readTree(response.body().string())
                .at("/choices/0/message/content")
                .asText();
        }
    }
}
