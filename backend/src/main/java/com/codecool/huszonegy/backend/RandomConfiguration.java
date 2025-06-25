package com.codecool.huszonegy.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Configuration
public class RandomConfiguration {
    @Bean
    public Random random() {
        return new Random(); // VAGY: new SecureRandom()
    }
}
