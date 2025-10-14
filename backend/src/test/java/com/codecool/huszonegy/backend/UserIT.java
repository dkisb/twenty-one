package com.codecool.huszonegy.backend;

import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.LoginRequestDTO;
import com.codecool.huszonegy.backend.model.payload.RegisterRequestDTO;
import com.codecool.huszonegy.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class UserIT {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public AuthenticationManager authManager() throws Exception {
            return Mockito.mock(AuthenticationManager.class); // mock létrehozása, de nem hardcoded
        }
    }

    @Autowired
    private AuthenticationManager authManager;

    @BeforeEach
    void cleanDb() {
        userRepository.deleteAll();
    }


    @Test
    void testCreateUser_Success() {
        // GIVEN
        RegisterRequestDTO request = new RegisterRequestDTO("john", "secret", "john@example.com");
        // WHEN
        ResponseEntity<Void> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/user/register",
                request,
                Void.class
        );

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(userRepository.findByUsername("john")).isPresent();
    }

    @Test
    void testCreateUser_UsernameAlreadyExists() {
        UserEntity existing = new UserEntity();
        existing.setUsername("jane");
        existing.setEmail("jane@example.com");
        existing.setPassword("encoded");
        userRepository.save(existing);

        RegisterRequestDTO request = new RegisterRequestDTO("jane", "pass", "new@example.com");
        // WHEN
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/user/register",
                request,
                String.class
        );

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).contains("Username 'jane' is already taken");
    }

    @Test
    void testCreateUser_EmailAlreadyExists() {
        UserEntity existing = new UserEntity();
        existing.setUsername("jane");
        existing.setEmail("jane@example.com");
        existing.setPassword("encoded");
        userRepository.save(existing);

        RegisterRequestDTO request = new RegisterRequestDTO("janet", "pass", "jane@example.com");
        // WHEN
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/user/register",
                request,
                String.class
        );

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).contains("Email is already taken: jane@example.com");
    }

    @Test
    void testLoginUser_Success() throws Exception {
        String username = "jane";
        String password = "pass";

        UserEntity existing = new UserEntity();
        existing.setUsername(username);
        existing.setEmail("jane@example.com");
        existing.setPassword(passwordEncoder.encode(password));
        userRepository.save(existing);

        Authentication auth = Mockito.mock(Authentication.class);
        User user = new User(username, existing.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_USER")));
        Mockito.when(auth.getPrincipal()).thenReturn(user);
        Mockito.when(authManager.authenticate(Mockito.any())).thenReturn(auth);

        LoginRequestDTO request = new LoginRequestDTO(username, password);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/user/login",
                request, String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("jwt");
    }
}

