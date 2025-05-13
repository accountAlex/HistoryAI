package com.techhack.aischemabuilder.assembler;

import com.techhack.aischemabuilder.entity.Message;
import com.techhack.aischemabuilder.model.MessageModel;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class MessageModelAssembler extends AbstractModelAssembler<Message, MessageModel> {

    @Override
    @NonNull
    public MessageModel toModel(@NonNull Message entity) {
        return new MessageModel()
            .setIsUser(entity.isUser())
            .setContent(entity.getContent())
            .setChatUuid(entity.getChat().getUuid())
            .setSendAt(entity.getSendAt());
    }
}
