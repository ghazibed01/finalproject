package com.example.AuthLinsoft.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserRegistrationDto {
    private String username;
    private String email;
    private String password;
    private String gender;
    private String degree;
    private Integer mobile;
    private String address;
    private String department;
    private Date joiningDate;
}
