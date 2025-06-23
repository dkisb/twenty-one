package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ShuffleService {
    private final ShuffleRepository shuffleRepository;

    public ShuffleService(ShuffleRepository shuffleRepository) {
        this.shuffleRepository = shuffleRepository;
    }

    public void addShuffledDeck(int userId) {
        List<Integer> shuffledCardIds = getShuffledCardIds();

        for(int i = 0; i < shuffledCardIds.size(); i++) {
            int cardId = shuffledCardIds.get(i);
            int order = i + 1;

            shuffleRepository.insertShuffledCard(cardId, userId, order);
        }
    }

    public Card getNextCardFromDeck(int userId, int order){
        return shuffleRepository.findCardByUserIdAndCardOrder(userId, order).orElseThrow(() -> new RuntimeException("Card not found"));//NoSuchElementException
    }

    private List<Integer> getShuffledCardIds() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);

        return cardIds;
    }
}
