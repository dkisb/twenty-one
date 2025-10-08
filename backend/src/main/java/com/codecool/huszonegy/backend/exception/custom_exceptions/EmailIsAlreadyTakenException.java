package com.codecool.huszonegy.backend.exception.custom_exceptions;

public class EmailIsAlreadyTakenException extends RuntimeException {
    public EmailIsAlreadyTakenException(String email) {
        super("Email is already taken: " + email);
    }
}
