package com.codecool.huszonegy.backend.exception.custom_exceptions;

public class NotAllowedOperationException extends RuntimeException {
    public NotAllowedOperationException(String message) {
        super(message);
    }
}
