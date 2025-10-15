package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.exception.custom_exceptions.EmailIsAlreadyTakenException;
import com.codecool.huszonegy.backend.exception.custom_exceptions.UsernameIsAlreadyTakenException;
import com.codecool.huszonegy.backend.model.payload.UserDTO;
import com.codecool.huszonegy.backend.model.payload.UserUpdateDTO;
import com.codecool.huszonegy.backend.model.entity.Role;
import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.JwtResponse;
import com.codecool.huszonegy.backend.model.payload.LoginRequestDTO;
import com.codecool.huszonegy.backend.model.payload.RegisterRequestDTO;
import com.codecool.huszonegy.backend.repository.UserRepository;
import com.codecool.huszonegy.backend.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
        RegisterRequestDTO request = new RegisterRequestDTO("testUser", "password123", "test@example.com");

        when(userRepository.existsByUsername("testUser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        // Act
        Map<String, String> result = userService.createUser(request);

        // Assert
        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository, times(1)).save(userCaptor.capture());

        UserEntity savedUser = userCaptor.getValue();
        assertEquals("testUser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertEquals(List.of(Role.ROLE_USER), savedUser.getRoles());
        assertEquals("User 'testUser' created successfully", result.get("message"));

        verify(userRepository, times(1)).existsByUsername("testUser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    void createUser_DuplicateUsername_ThrowsException() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO("testUser", "test@example.com", "password123");
        when(userRepository.existsByUsername("testUser")).thenReturn(true);

        // Act & Assert
        UsernameIsAlreadyTakenException exception = assertThrows(UsernameIsAlreadyTakenException.class, () -> userService.createUser(request));
        assertEquals("Username 'testUser' is already taken", exception.getMessage());

        verify(userRepository, times(1)).existsByUsername("testUser");
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO("testUser", "password123", "test@example.com");

        when(userRepository.existsByUsername("testUser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        EmailIsAlreadyTakenException exception = assertThrows(EmailIsAlreadyTakenException.class, () -> userService.createUser(request));
        assertEquals("Email is already taken: test@example.com", exception.getMessage());

        verify(userRepository, times(1)).existsByUsername("testUser");
        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void loginUser_Success_ReturnsJwtResponse() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO("testUser", "password123");

        Authentication authentication = mock(Authentication.class);
        User userDetails = new User("testUser", "encodedPassword", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwtToken");
        // Act
        JwtResponse response = userService.loginUser(request);
        // Assert
        assertEquals("jwtToken", response.jwt());
        assertEquals("testUser", response.userName());
        assertEquals(List.of("ROLE_USER"), response.roles());

        verify(authenticationManager, times(1)).authenticate(
                argThat(token -> token.getPrincipal().equals("testUser") && token.getCredentials().equals("password123")));
        verify(jwtUtils, times(1)).generateJwtToken(authentication);
    }

    @Test
    void loginUser_AuthenticationFails_ThrowsException() {
        // Arrange
        LoginRequestDTO loginRequest = new LoginRequestDTO("testUser", "wrongPassword");

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

    @Test
    void editUserWhenUserUpdateDTOIsValidThenSaveUser() {
        UserUpdateDTO dto = new UserUpdateDTO(1, 1, 0, 5);
        User springUser = new User("userName", "password", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        UserEntity currentUser = new UserEntity();
        currentUser.setUsername("userName");
        currentUser.setPlayedGames(3);
        currentUser.setWonGames(2);
        currentUser.setLostGames(1);
        currentUser.setCreditBalance(35);
        when(userRepository.findByUsername(springUser.getUsername())).thenReturn(Optional.of(currentUser));

        Map<String, String> response = userService.editUser(dto);

        ArgumentCaptor<UserEntity> userEntityArgumentCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository, times(1)).findByUsername(springUser.getUsername());
        verify(userRepository, times(1)).save(userEntityArgumentCaptor.capture());
        UserEntity userEntity = userEntityArgumentCaptor.getValue();
        assertEquals("userName", userEntity.getUsername());
        assertEquals(4, userEntity.getPlayedGames());
        assertEquals(3, userEntity.getWonGames());
        assertEquals(1, userEntity.getLostGames());
        assertEquals(40, userEntity.getCreditBalance());
        assertEquals("User 'userName' has been updated", response.get("message"));
    }

    @Test
    void editUserWhenUserNotFoundThenThrowsNoSuchElementException() {
        UserUpdateDTO dto = new UserUpdateDTO(1, 1, 0, 5);
        User springUser = new User("userName", "password", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername(springUser.getUsername())).thenReturn(Optional.empty());
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> userService.editUser(dto));
        assertEquals("User 'userName' not found", exception.getMessage());
    }

    @Test
    void getMeWhenUserIsAuthenticatedThenReturnMe() {
        User springUser = new User("myUserName", "myPassword", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        UserEntity currentUser = new UserEntity();
        currentUser.setUsername("myUserName");
        currentUser.setPlayedGames(3);
        currentUser.setWonGames(2);
        currentUser.setLostGames(1);
        currentUser.setCreditBalance(35);
        when(userRepository.findByUsername("myUserName")).thenReturn(Optional.of(currentUser));
        UserDTO expected = new UserDTO("myUserName", 3, 2, 1, 35);
        assertEquals(expected, userService.getMe());
    }

    @Test
    void getMeWhenUserNotFoundThenThrowsNoSuchElementException() {
        User springUser = new User("myUserName", "myPassword", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findByUsername("myUserName")).thenReturn(Optional.empty());
        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> userService.getMe());
        assertEquals("User 'myUserName' not found", exception.getMessage());
    }
}