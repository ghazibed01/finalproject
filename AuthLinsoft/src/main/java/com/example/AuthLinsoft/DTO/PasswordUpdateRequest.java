package com.example.AuthLinsoft.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateRequest {
    private String username;
    private String currentPassword;
    private String newPassword;
}
