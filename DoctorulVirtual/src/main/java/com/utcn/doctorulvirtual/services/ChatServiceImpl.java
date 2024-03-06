package com.utcn.doctorulvirtual.services;

import com.utcn.doctorulvirtual.controllers.models.PromptRequestModel;
import com.utcn.doctorulvirtual.controllers.models.PromptResponseModel;
import com.utcn.doctorulvirtual.services.dtos.ChatRequestDTO;
import com.utcn.doctorulvirtual.services.dtos.ChatResponseDTO;
import com.utcn.doctorulvirtual.services.dtos.MessageDTO;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class ChatServiceImpl implements ChatService {

    @Qualifier("aiRestTemplate")
    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.model}") //Asigneaza valoarea corespunzatoare proprietatii din application.properties
    private String model;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.system.message}")
    private String systemMessage;

    private ChatRequestDTO requestDTO;

    @PostConstruct
    private void createSystemMessage() {
        requestDTO = new ChatRequestDTO(model, "system", systemMessage);
    } //Creeaza o conversatie noua si pune mesajul de sistem

    @Override
    public PromptResponseModel chat(PromptRequestModel prompt) {
        requestDTO.addNewMessage("user", prompt.getPrompt()); //Adauga noul prompt in lista de mesaje

        ChatResponseDTO response = restTemplate.postForObject(apiUrl, requestDTO, ChatResponseDTO.class); //Apeleaza API-ul chatbotului

        if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
            return new PromptResponseModel("No response"); //Error handling
        }

        return new PromptResponseModel(response.getChoices().get(0).getMessage().getContent()); //Returneaza raspunsul chatbotului
    }

    @Override
    public void resetConversation() {
        log.info("Resetting messages...");
        List<MessageDTO> newConversation = new ArrayList<>();
        newConversation.add(new MessageDTO("system", systemMessage)); //Reseateaza conversatia si adauga din nou mesajul de sistem
        requestDTO.setMessages(newConversation);
    }


}
