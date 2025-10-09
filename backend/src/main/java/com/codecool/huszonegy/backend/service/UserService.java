package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.exception.custom_exceptions.EmailIsAlreadyTakenException;
import com.codecool.huszonegy.backend.exception.custom_exceptions.UsernameIsAlreadyTakenException;
import com.codecool.huszonegy.backend.model.UserDTO;
import com.codecool.huszonegy.backend.model.UserUpdateDTO;
import com.codecool.huszonegy.backend.model.entity.Role;
import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.JwtResponse;
import com.codecool.huszonegy.backend.model.payload.UserRequest;
import com.codecool.huszonegy.backend.repository.UserRepository;
import com.codecool.huszonegy.backend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    public void createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameIsAlreadyTakenException(request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailIsAlreadyTakenException(request.getEmail());
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of(Role.ROLE_USER));

        userRepository.save(user);
    }

    public ResponseEntity<?> loginUser(UserRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        User userDetails = (User) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles));
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
        currentUser.setCreditBalance(currentUser.getCreditBalance() + update.addWinnings());
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
}