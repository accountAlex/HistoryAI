package com.techhack.aischemabuilder.kafka.inbound;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techhack.aischemabuilder.entity.Chat;
import com.techhack.aischemabuilder.kafka.request.LlmRequest;
import com.techhack.aischemabuilder.kafka.response.LlmResponse;
import com.techhack.aischemabuilder.service.chat.ChatService;
import com.techhack.aischemabuilder.service.llm.LlmService;
import com.techhack.aischemabuilder.service.message.MessageService;
import com.techhack.aischemabuilder.service.websocket.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.kafka.inbound.KafkaMessageDrivenChannelAdapter;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;

import java.util.Map;

@Configuration
public class IntegrationInBoundFlowConfiguration {

    private final LlmService llmService;
    private final ChatService chatService;
    private final MessageService messageService;

    @Autowired
    public IntegrationInBoundFlowConfiguration(
        LlmService llmService,
        ChatService chatService,
        MessageService messageService
    ) {
        this.llmService = llmService;
        this.chatService = chatService;
        this.messageService = messageService;
    }

    @Bean
    public IntegrationFlow kafkaInboundFlow(KafkaMessageDrivenChannelAdapter<String, Object> adapter) {
        return IntegrationFlow.from(adapter)
            .handle(this::handleMessage)
            .get();
    }

    private void handleMessage(Message<?> message) {
        try {
            Map<String, String> payloadMap = (Map<String, String>) message.getPayload();
            String messageType = payloadMap.get("type");
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            switch (messageType) {
                case "LlmResponse":
                    LlmResponse response = objectMapper.convertValue(payloadMap, LlmResponse.class);
                    Chat chat = chatService.getChatByUuid(response.getChatUuid());
                    // Save bot's message to database
                    messageService.saveMessage(
                        new com.techhack.aischemabuilder.request.SaveMessageRequest()
                            .setUuid(response.getChatUuid())
                            .setContent(response.getContent()),
                        chat,
                        false // isUser = false for bot messages
                    );
                    llmService.handleChatMessage(chat, response.getContent());
                    break;
                case "LlmPhotoResponse":
                    //логика для фото
                    break;
                default:
                    System.out.println("Неизвестный тип сообщения: " + messageType);
            }
        } catch (Exception e) {
            System.out.println("Ошибка обработки сообщения: " + e.getMessage());
        }
    }

}
