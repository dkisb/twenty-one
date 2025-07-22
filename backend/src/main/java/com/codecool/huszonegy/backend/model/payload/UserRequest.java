package com.codecool.huszonegy.backend.model.payload;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private String email;
    private String role;
}
