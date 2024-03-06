package com.utcn.doctorulvirtual.services.dtos;

import lombok.Data;

import java.util.List;

@Data
public class ChatResponseDTO {

    private List<Choice> choices;

    @Data
    public static class Choice {

        private int index;
        private MessageDTO message;
    }
}
