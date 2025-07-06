package com.example.AuthLinsoft.Auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
    /**
     * The JWT token generated upon successful authentication.
     */
    private String jwtToken;
}
