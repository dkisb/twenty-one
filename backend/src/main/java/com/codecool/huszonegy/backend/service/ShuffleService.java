package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.model.entity.Shuffle;
import com.codecool.huszonegy.backend.repository.CardRepository;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ShuffleService {
    private final ShuffleRepository shuffleRepository;
    private final CardRepository cardRepository;
    private final Random random;
    private final UserService userService;

    public ShuffleService(ShuffleRepository shuffleRepository, CardRepository cardRepository, Random random, UserService userService) {
        this.shuffleRepository = shuffleRepository;
        this.cardRepository = cardRepository;
        this.random = random;
        this.userService = userService;
    }

    @Transactional
    public Map<String, String> addShuffledDeck() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        int userId = userService.getUserId(user.getUsername());
        shuffleRepository.deleteByUserId(userId);
        List<Integer> shuffledCardIndexes = getShuffledCardIndexes();
        List<Shuffle> cardsToSave = new ArrayList<>();
        List<Card> allCards = cardRepository.findAll();
        for (int i = 0; i < shuffledCardIndexes.size(); i++) {
            int orderInIndexes = shuffledCardIndexes.get(i);
            Card card = allCards.stream().filter(e -> e.getId() == orderInIndexes).findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Card not found"));
            cardsToSave.add(new Shuffle(card, userId, i + 1));
        }
        shuffleRepository.saveAll(cardsToSave);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Shuffled deck generated for user " + user.getUsername());
        return response;
    }

    public Card getNextCardFromDeck(String userName, int order) {
        int userId = userService.getUserId(userName);
        return shuffleRepository.findCardByUserIdAndCardOrder(userId, order)
                .orElseThrow(() -> new NoSuchElementException("Card not found"));
    }

    List<Integer> getShuffledCardIndexes() {
        List<Integer> cardIndexes = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIndexes, random);
        return cardIndexes;
    }
}