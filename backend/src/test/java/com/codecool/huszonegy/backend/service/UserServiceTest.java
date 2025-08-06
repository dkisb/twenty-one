package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.entity.Role;
import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.JwtResponse;
import com.codecool.huszonegy.backend.model.payload.UserRequest;
import com.codecool.huszonegy.backend.repository.UserRepository;
import com.codecool.huszonegy.backend.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder, authenticationManager, jwtUtils);
    }

    @Test
    void createUser_Success_CreatesAndSavesUser() {
        // Arrange
        UserRequest request = new UserRequest();
        request.setUsername("testUser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.existsByUsername("testUser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> {
            UserEntity user = invocation.getArgument(0);
            user.setId(1); // Simulate saving with an ID
            return user;
        });

        // Act
        userService.createUser(request);

        // Assert
        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository, times(1)).save(userCaptor.capture());

        UserEntity savedUser = userCaptor.getValue();
        assertEquals("testUser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertEquals(List.of(Role.ROLE_USER), savedUser.getRoles());

        verify(userRepository, times(1)).existsByUsername("testUser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    void createUser_DuplicateUsername_ThrowsException() {
        // Arrange
        UserRequest request = new UserRequest();
        request.setUsername("testUser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.existsByUsername("testUser")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.createUser(request));
        assertEquals("Error: Username is already taken!", exception.getMessage());

        verify(userRepository, times(1)).existsByUsername("testUser");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        // Arrange
        UserRequest request = new UserRequest();
        request.setUsername("testUser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.existsByUsername("testUser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.createUser(request));
        assertEquals("Error: Email is already in use!", exception.getMessage());

        verify(userRepository, times(1)).existsByUsername("testUser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void loginUser_Success_ReturnsJwtResponse() {
        // Arrange
        UserRequest loginRequest = new UserRequest();
        loginRequest.setUsername("testUser");
        loginRequest.setPassword("password123");

        Authentication authentication = mock(Authentication.class);
        User userDetails = new User("testUser", "encodedPassword", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwtToken");

        // Act
        ResponseEntity<?> response = userService.loginUser(loginRequest);

        // Assert
        assertInstanceOf(JwtResponse.class, response.getBody());
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertEquals("jwtToken", jwtResponse.jwt());
        assertEquals("testUser", jwtResponse.userName());
        assertEquals(List.of("ROLE_USER"), jwtResponse.roles());

        verify(authenticationManager, times(1)).authenticate(
                argThat(token -> token.getPrincipal().equals("testUser") && token.getCredentials().equals("password123")));
        verify(jwtUtils, times(1)).generateJwtToken(authentication);
    }

    @Test
    void loginUser_AuthenticationFails_ThrowsException() {
        // Arrange
        UserRequest loginRequest = new UserRequest();
        loginRequest.setUsername("testUser");
        loginRequest.setPassword("wrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Authentication failed"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.loginUser(loginRequest));
        assertEquals("Authentication failed", exception.getMessage());

        verify(authenticationManager, times(1)).authenticate(
                argThat(token -> token.getPrincipal().equals("testUser") && token.getCredentials().equals("wrongPassword")));
        verify(jwtUtils, never()).generateJwtToken(any());
    }

    @Test
    void getUserId_UserExists_ReturnsId() {
        // Arrange
        String username = "testUser";
        UserEntity user = new UserEntity();
        user.setId(1);
        user.setUsername("testUser");
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        // Act
        int userId = userService.getUserId(username);

        // Assert
        assertEquals(1, userId);
        verify(userRepository, times(1)).findByUsername("testUser");
    }

    @Test
    void getUserId_UserNotFound_ThrowsException() {
        // Arrange
        String username = "unknownUser";
        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.getUserId(username));
        assertEquals("User not found with username: unknownUser", exception.getMessage());

        verify(userRepository, times(1)).findByUsername("unknownUser");
    }
}