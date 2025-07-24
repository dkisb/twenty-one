package com.codecool.huszonegy.backend.controller;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.service.ShuffleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shuffle")
public class ShuffleController {

    private final ShuffleService shuffleService;

    @Autowired
    public ShuffleController(ShuffleService shuffleService) {
        this.shuffleService = shuffleService;
    }

    @PostMapping()
    public String generateShuffledDeck() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        shuffleService.addShuffledDeck(user.getUsername());
        return "Shuffled deck generated for user " + user.getUsername();
    }

    @GetMapping("/getnext")
        public Card getNextCardFromDeck(@RequestParam int order) {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return shuffleService.getNextCardFromDeck(user.getUsername(), order);
    }
}
