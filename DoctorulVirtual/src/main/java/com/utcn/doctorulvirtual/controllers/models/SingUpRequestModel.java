package com.utcn.doctorulvirtual.controllers.models;

import lombok.Data;

@Data
public class SingUpRequestModel {

    private String name;
    private String username;
    private String email;
    private String password;
}
