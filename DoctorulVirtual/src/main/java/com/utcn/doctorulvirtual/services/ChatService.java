package com.utcn.doctorulvirtual.services;

import com.utcn.doctorulvirtual.controllers.models.PromptRequestModel;
import com.utcn.doctorulvirtual.controllers.models.PromptResponseModel;

public interface ChatService {

    PromptResponseModel chat(PromptRequestModel prompt);

    void resetConversation();
}
