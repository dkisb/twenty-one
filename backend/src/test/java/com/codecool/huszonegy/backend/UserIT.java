package com.codecool.huszonegy.backend;

import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.model.payload.UserRequest;
import com.codecool.huszonegy.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserIT {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDb() {
        userRepository.deleteAll();
    }


    @Test
    void testCreateUser_Success() {
        // GIVEN
        UserRequest request = new UserRequest();
        request.setUsername("john");
        request.setEmail("john@example.com");
        request.setPassword("secret");

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
        // GIVEN: először beszúrunk egy usert
        UserEntity existing = new UserEntity();
        existing.setUsername("jane");
        existing.setEmail("jane@example.com");
        existing.setPassword("encoded"); // itt mindegy, H2-ben csak tárolás
        userRepository.save(existing);

        UserRequest request = new UserRequest();
        request.setUsername("jane"); // ugyanaz a username
        request.setEmail("new@example.com");
        request.setPassword("pass");

        // WHEN
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/user/register",
                request,
                String.class
        );

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).contains("Username is already taken");
    }
}

