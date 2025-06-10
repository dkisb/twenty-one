package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShuffleService {
    private final CardService cardService;
    private final ShuffleRepository shuffleRepository;

    public ShuffleService(CardService cardService, ShuffleRepository shuffleRepository) {
        this.cardService = cardService;
        this.shuffleRepository = shuffleRepository;
    }

    public void addShuffledDeck(int userId) {
        List<Integer> shuffledCardIds = cardService.getShuffledCardIds();

        for(int i = 0; i < shuffledCardIds.size(); i++) {
            int cardId = shuffledCardIds.get(i);
            int order = i + 1;

            shuffleRepository.insertShuffledCard(cardId, userId, order);
        }
    }

    public Card getNextCardFromDeck(int userId, int order){
        return shuffleRepository.findCardByUserIdAndCardOrder(userId, order).orElseThrow(() -> new RuntimeException("Card not found"));
    }
}
