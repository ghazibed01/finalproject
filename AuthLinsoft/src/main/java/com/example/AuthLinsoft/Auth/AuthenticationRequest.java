package com.example.AuthLinsoft.Auth;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationRequest {

    /**
     * The email address associated with the user requesting authentication.
     */
    private String email;

    /**
     * The password associated with the user's account, used for authentication.
     */
    private String password;

}
