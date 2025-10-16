package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.exception.custom_exceptions.EmailIsAlreadyTakenException;
import com.codecool.huszonegy.backend.exception.custom_exceptions.NotAllowedOperationException;
import com.codecool.huszonegy.backend.exception.custom_exceptions.UsernameIsAlreadyTakenException;
import com.codecool.huszonegy.backend.model.payload.UserDTO;
import com.codecool.huszonegy.backend.model.payload.UserUpdateDTO;
import com.codecool.huszonegy.backend.model.entity.Role;
import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.EditCredentialRequestDTO;
import com.codecool.huszonegy.backend.model.payload.JwtResponse;
import com.codecool.huszonegy.backend.model.payload.LoginRequestDTO;
import com.codecool.huszonegy.backend.model.payload.RegisterRequestDTO;
import com.codecool.huszonegy.backend.repository.UserRepository;
import com.codecool.huszonegy.backend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public Map<String, String> createUser(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameIsAlreadyTakenException(request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailIsAlreadyTakenException(request.email());
        }
        UserEntity user = new UserEntity();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRoles(List.of(Role.ROLE_USER));
        userRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", String.format("User '%s' created successfully", request.username()));
        return response;
    }

    public JwtResponse loginUser(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        User userDetails = (User) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getUsername(), roles);
    }

    public int getUserId(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found with username: " + username))
                .getId();
    }

    public Map<String, String> editUser(UserUpdateDTO update) {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        UserEntity currentUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NoSuchElementException(String.format("User '%s' not found", user.getUsername())));
        currentUser.setPlayedGames(currentUser.getPlayedGames() + update.addGame());
        currentUser.setWonGames(currentUser.getWonGames() + update.addWin());
        currentUser.setLostGames(currentUser.getLostGames() + update.addLose());
        
        // Ensure balance never goes negative
        int newBalance = currentUser.getCreditBalance() + update.addWinnings();
        currentUser.setCreditBalance(Math.max(0, newBalance));
        
        userRepository.save(currentUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", String.format("User '%s' has been updated", user.getUsername()));
        return response;
    }

    public UserDTO getMe() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        UserEntity currentUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NoSuchElementException(String.format("User '%s' not found", user.getUsername())));
        return new UserDTO(currentUser.getUsername(), currentUser.getPlayedGames(), currentUser.getWonGames(), currentUser.getLostGames(), currentUser.getCreditBalance());
    }

    public Map<String, String> deleteMe() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        UserEntity currentUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NoSuchElementException(String.format("User '%s' not found", user.getUsername())));
        userRepository.delete(currentUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", String.format("User '%s' has been deleted", user.getUsername()));
        return response;
    }

    public Map<String, String> editCredentials(EditCredentialRequestDTO request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity currentUser = userRepository.findByUsername(user.getUsername()).orElseThrow(() -> new NoSuchElementException(String.format("User '%s' not found", user.getUsername())));
        Map<String, String> result = new HashMap<>();
        if (!request.username().equals(user.getUsername()) && userRepository.existsByUsername(request.username())) {
            throw new UsernameIsAlreadyTakenException(request.username());
        }
        if(!passwordEncoder.matches(request.password(), currentUser.getPassword())) {
            throw new NotAllowedOperationException(String.format("Invalid password for user '%s'", user.getUsername()));
        }
        currentUser.setUsername(request.username());
        if (!request.newPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(request.newPassword()));
        }
        userRepository.save(currentUser);

        if (request.username().equals(user.getUsername())) {
            result.put("message",String.format("User '%s' edited successfully", user.getUsername()));
        } else {
            result.put("message", String.format("User '%s' edited successfully. The new username is '%s'.", user.getUsername(), request.username()));
        }
        return result;
    }
}