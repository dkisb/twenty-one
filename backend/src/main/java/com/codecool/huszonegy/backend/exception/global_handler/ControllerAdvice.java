package com.codecool.huszonegy.backend.exception.global_handler;

import com.codecool.huszonegy.backend.exception.custom_exceptions.EmailIsAlreadyTakenException;
import com.codecool.huszonegy.backend.exception.custom_exceptions.UsernameIsAlreadyTakenException;
import com.codecool.huszonegy.backend.model.ErrorMessage;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(UsernameIsAlreadyTakenException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorMessage handleUsernameAlreadyExists(UsernameIsAlreadyTakenException e) {
        return new ErrorMessage(HttpStatus.CONFLICT.value(), e.getMessage());
    }

    @ExceptionHandler(EmailIsAlreadyTakenException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorMessage handleEmailAlreadyExists(EmailIsAlreadyTakenException e) {
        return new ErrorMessage(HttpStatus.CONFLICT.value(), e.getMessage());
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage handleNotFound(NoSuchElementException ex) {
        return new ErrorMessage(HttpStatus.NOT_FOUND.value(), ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage handleBadRequest(IllegalArgumentException ex) {
        return new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
    }

    @ExceptionHandler(DataAccessException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage handleDatabaseError(DataAccessException ex) {
        return new ErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorMessage handleBadCredentialsException(BadCredentialsException ex) {
        return new ErrorMessage(HttpStatus.UNAUTHORIZED.value(), "Wrong username or password");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage handleGeneric(Exception ex) {
        return new ErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
    }

}
