package com.utcn.doctorulvirtual.services.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ChatRequestDTO {

    private String model;
    private List<MessageDTO> messages;
    private int n;
    private double temperature;

    public ChatRequestDTO(String model, String role, String prompt) {
        this.model = model;

        this.messages = new ArrayList<>();
        this.messages.add(new MessageDTO(role, prompt));
    }

    public void addNewMessage(String role, String prompt){
        this.messages.add(new MessageDTO(role, prompt));
    }
}
