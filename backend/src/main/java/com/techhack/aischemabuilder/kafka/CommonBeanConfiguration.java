package com.techhack.aischemabuilder.kafka;

import com.techhack.aischemabuilder.kafka.request.LlmRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.messaging.MessageChannel;

@Configuration
public class CommonBeanConfiguration {

    @Bean
    public MessageChannel kafkaOutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageChannel kafkaInboundChannel() {
        return new DirectChannel();
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(
        ProducerFactory<String, Object> producerFactory
    ) {
        return new KafkaTemplate<>(producerFactory);
    }

}
