package com.codecool.huszonegy.backend;

import com.codecool.huszonegy.backend.service.CardService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	/*@Bean
	CommandLineRunner runner(CardService service) {
		return args -> {
			service.generateAllCards(); // ❗️ Will only run once when the app starts
		};
	}*/


}
