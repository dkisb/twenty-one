package com.codecool.huszonegy.backend.model.payload;

public record EditCredentialRequestDTO(String username, String password, String newPassword) {
}
