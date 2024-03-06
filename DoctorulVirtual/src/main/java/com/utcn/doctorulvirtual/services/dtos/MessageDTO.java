package com.utcn.doctorulvirtual.services.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageDTO {

    private String role;
    private String content;
}
