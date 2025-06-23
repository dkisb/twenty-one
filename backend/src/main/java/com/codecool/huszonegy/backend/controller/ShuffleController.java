package com.codecool.huszonegy.backend.controller;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.service.ShuffleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shuffle")
public class ShuffleController {

    private final ShuffleService shuffleService;

    @Autowired
    public ShuffleController(ShuffleService shuffleService) {
        this.shuffleService = shuffleService;
    }

    @PostMapping("/generate/{userId}")
    public String generateShuffledDeck(@PathVariable int userId) {
        shuffleService.addShuffledDeck(userId);
        return "Shuffled deck generated for user " + userId;
    }

    @GetMapping("/getnext/{userId}")
        public Card getNextCardFromDeck(@PathVariable int userId,@RequestParam int order) {
        return shuffleService.getNextCardFromDeck(userId, order);
    }
}
