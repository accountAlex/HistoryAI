package com.techhack.aischemabuilder.assembler;

import com.techhack.aischemabuilder.model.ChatModel;
import com.techhack.aischemabuilder.entity.Chat;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class ChatModelAssembler extends AbstractModelAssembler<Chat, ChatModel> {

    @Override
    @NonNull
    public ChatModel toModel(@NonNull Chat entity) {
        return new ChatModel()
            .setUuid(entity.getUuid())
            .setCreatedAt(entity.getCreatedAt());
    }
}
