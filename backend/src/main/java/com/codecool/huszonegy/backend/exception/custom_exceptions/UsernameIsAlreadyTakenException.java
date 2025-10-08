package com.codecool.huszonegy.backend.exception.custom_exceptions;

public class UsernameIsAlreadyTakenException extends RuntimeException {
    public UsernameIsAlreadyTakenException(String username) {
        super(String.format("Username '%s' is already taken", username));
    }
}
