package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.User;
import com.codecool.huszonegy.backend.repository.ShuffleDao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShuffleService {
    private final CardService cardService;
    private final ShuffleDao shuffleDao;

    public ShuffleService(CardService cardService, ShuffleDao shuffleDao) {
        this.cardService = cardService;
        this.shuffleDao = shuffleDao;
    }

    public void addShuffledDeck(int userId) {
        List<Integer> shuffledCardIds = cardService.getShuffledCardIds();

        for(int i = 0; i < shuffledCardIds.size(); i++) {
            int cardId = shuffledCardIds.get(i);
            int order = i + 1;

            shuffleDao.insertShuffledCard(cardId, userId, order);
        }
    }
}
