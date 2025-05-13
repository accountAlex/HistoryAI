package com.techhack.aischemabuilder.kafka.outbound;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.expression.common.LiteralExpression;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.kafka.outbound.KafkaProducerMessageHandler;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.messaging.MessageHandler;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaOutBoundConfig {

    private final String brokerAddress;

    private final String topic;

    @Autowired
    public KafkaOutBoundConfig(
        @Value("${spring.kafka.bootstrap-servers}") String brokerAddress,
        @Value("${spring.kafka.producer.topic}") String topic
    ) {
        this.brokerAddress = brokerAddress;
        this.topic = topic;
    }

    @Bean
    @ServiceActivator(inputChannel = "kafkaOutboundChannel")
    public MessageHandler outboundMessageHandler(KafkaTemplate<String, Object> kafkaTemplate) {
        KafkaProducerMessageHandler<String, Object> handler = new KafkaProducerMessageHandler<>(kafkaTemplate);
        handler.setTopicExpression(new LiteralExpression(topic));
        return handler;
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokerAddress);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(props);
    }
}
