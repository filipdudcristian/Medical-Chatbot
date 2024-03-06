package com.utcn.doctorulvirtual.controllers;

import com.utcn.doctorulvirtual.controllers.models.PromptRequestModel;
import com.utcn.doctorulvirtual.controllers.models.PromptResponseModel;
import com.utcn.doctorulvirtual.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ChatController {

    public final ChatService chatService;

    @PostMapping("/chat")
    public PromptResponseModel chat(@RequestBody PromptRequestModel prompt) {
        return chatService.chat(prompt);
    }
}
