package com.codecool.huszonegy.backend.controller;

import com.codecool.huszonegy.backend.model.payload.UserDTO;
import com.codecool.huszonegy.backend.model.payload.UserUpdateDTO;
import com.codecool.huszonegy.backend.model.payload.EditCredentialRequestDTO;
import com.codecool.huszonegy.backend.model.payload.JwtResponse;
import com.codecool.huszonegy.backend.model.payload.LoginRequestDTO;
import com.codecool.huszonegy.backend.model.payload.RegisterRequestDTO;
import com.codecool.huszonegy.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> createUser(@RequestBody RegisterRequestDTO signUpRequest) {
        return userService.createUser(signUpRequest);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public JwtResponse authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
        return userService.loginUser(loginRequest);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserDTO me() {
        return userService.getMe();
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> updateUser(@RequestBody UserUpdateDTO update) {
        return userService.editUser(update);
    }

    @PatchMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> editCredentials(@RequestBody EditCredentialRequestDTO request) {
        return userService.editCredentials(request);
    }

    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, String> deleteMe() {
        return userService.deleteMe();
    }
}
