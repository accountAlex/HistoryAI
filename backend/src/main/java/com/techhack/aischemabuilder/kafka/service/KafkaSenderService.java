package com.techhack.aischemabuilder.kafka.service;

import com.techhack.aischemabuilder.kafka.request.LlmRequest;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class KafkaSenderService {

    private final MessageChannel kafkaOutboundChannel;

    public KafkaSenderService(@Qualifier("kafkaOutboundChannel") MessageChannel kafkaOutboundChannel) {
        this.kafkaOutboundChannel = kafkaOutboundChannel;
    }

    public void sendMessage(
        @NonNull String chatUuid,
        @NonNull String message
    ) {
        LlmRequest request = new LlmRequest(chatUuid, message);
        kafkaOutboundChannel.send(MessageBuilder.withPayload(request).build());
    }

    public void sendMessage(
        @NonNull String chatUuid,
        @NonNull String message,
        @NonNull Boolean needImages
    ) {
        LlmRequest request = new LlmRequest(chatUuid, message, needImages);
        kafkaOutboundChannel.send(MessageBuilder.withPayload(request).build());
    }

}
