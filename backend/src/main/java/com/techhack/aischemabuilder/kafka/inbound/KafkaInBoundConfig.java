package com.techhack.aischemabuilder.kafka.inbound;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.kafka.inbound.KafkaMessageDrivenChannelAdapter;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.messaging.MessageChannel;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaInBoundConfig {

    private final String bootstrapServers;

    private final String groupId;

    private final String topic;

    @Autowired
    public KafkaInBoundConfig(
        @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
        @Value("${spring.kafka.consumer.group-id}") String groupId,
        @Value("${spring.kafka.consumer.topic}") String topic
    ) {
        this.bootstrapServers = bootstrapServers;
        this.groupId = groupId;
        this.topic = topic;
    }

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, Object.class.getName());
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public KafkaMessageDrivenChannelAdapter<String, Object> adapter(
        @Qualifier("kafkaInboundChannel") MessageChannel inBoundChannel,
        ConcurrentMessageListenerContainer<String, Object> container
    ) {
        KafkaMessageDrivenChannelAdapter<String, Object> adapter =
            new KafkaMessageDrivenChannelAdapter<>(container, KafkaMessageDrivenChannelAdapter.ListenerMode.record);
        adapter.setOutputChannel(inBoundChannel);
        return adapter;
    }

    @Bean
    public ConcurrentMessageListenerContainer<String, Object> kafkaListenerContainer(
        ConsumerFactory<String, Object> consumerFactory
    ) {
        ContainerProperties containerProperties = new ContainerProperties(topic);
        containerProperties.setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return new ConcurrentMessageListenerContainer<>(consumerFactory, containerProperties);
    }

}
