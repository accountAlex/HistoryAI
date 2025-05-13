package com.techhack.aischemabuilder.kafka.outbound;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class IntegrationOutBoundFlowConfiguration {

    @Bean
    public IntegrationFlow kafkaOutboundFlow(
        @Qualifier("kafkaOutboundChannel") MessageChannel messageChannel,
        @Qualifier("outboundMessageHandler") MessageHandler messageHandler
    ) {
        return IntegrationFlow
            .from(messageChannel)
            .log("Успешно отправил")
            .handle(messageHandler)
            .get();
    }

}
