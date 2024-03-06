package com.utcn.doctorulvirtual.controllers.models;

import lombok.Data;

@Data
public class LoginRequestModel {

    private String usernameOrEmail;
    private String password;
}
