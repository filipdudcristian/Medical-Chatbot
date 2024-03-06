package com.utcn.doctorulvirtual.controllers.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseModel {

    private String user;
    private String role;
}
