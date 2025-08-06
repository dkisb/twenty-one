package com.codecool.huszonegy.backend.controller;

import com.codecool.huszonegy.backend.model.UserDTO;
import com.codecool.huszonegy.backend.model.UserUpdateDTO;
import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.JwtResponse;
import com.codecool.huszonegy.backend.model.payload.UserRequest;
import com.codecool.huszonegy.backend.repository.UserRepository;
import com.codecool.huszonegy.backend.security.jwt.JwtUtils;
import com.codecool.huszonegy.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public UserController(UserRepository userRepository, JwtUtils jwtUtils, AuthenticationManager authenticationManager, UserService userService) {
        this.userRepository = userRepository;
        this.encoder = new BCryptPasswordEncoder();
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void createUser(@RequestBody UserRequest signUpRequest) {
        userService.createUser(signUpRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        User userDetails = (User) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public UserDTO me() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        UserEntity currentUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(user.getUsername()));
        return new UserDTO(currentUser.getUsername(), currentUser.getPlayedGames(), currentUser.getWonGames(), currentUser.getLostGames(), currentUser.getCreditBalance());
        //return "Hello " + user.getUsername() + " " + user.getAuthorities();
    }

    @PutMapping("/update")
    public void updateUser(@RequestBody UserUpdateDTO update) {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        UserEntity currentUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(user.getUsername()));
        currentUser.setPlayedGames(currentUser.getPlayedGames() + update.addGame());
        currentUser.setWonGames(currentUser.getWonGames() + update.addWin());
        currentUser.setLostGames(currentUser.getLostGames() + update.addLose());
        currentUser.setCreditBalance(currentUser.getCreditBalance() + update.addWinnings());
        userRepository.save(currentUser);
    }
}
