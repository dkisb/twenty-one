package com.codecool.huszonegy.backend.controller;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.service.ShuffleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/shuffle")
public class ShuffleController {

    private final ShuffleService shuffleService;

    @Autowired
    public ShuffleController(ShuffleService shuffleService) {
        this.shuffleService = shuffleService;
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> generateShuffledDeck() {
        return shuffleService.addShuffledDeck();
    }

    @GetMapping("/getnext")
    @ResponseStatus(HttpStatus.OK)
        public Card getNextCardFromDeck(@RequestParam int order) {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return shuffleService.getNextCardFromDeck(user.getUsername(), order);
    }
}
