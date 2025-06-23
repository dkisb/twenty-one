package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.model.Shuffle;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.ArrayList;

@Service
public class ShuffleService {
    private final ShuffleRepository shuffleRepository;
    private final EntityManager entityManager;

    public ShuffleService(ShuffleRepository shuffleRepository, EntityManager entityManager) {
        this.shuffleRepository = shuffleRepository;
        this.entityManager = entityManager;
    }

    public void addShuffledDeck(int userId) {
        List<Integer> shuffledCardIds = getShuffledCardIds();
        List<Shuffle> cardsToSave = new ArrayList<>();
        for (int i = 0; i < shuffledCardIds.size(); i++) {
            int cardId = shuffledCardIds.get(i);
            Card cardRef = entityManager.getReference(Card.class, cardId);
            cardsToSave.add(new Shuffle(cardRef, userId, i + 1));
        }
        shuffleRepository.saveAll(cardsToSave);
    }

    public Card getNextCardFromDeck(int userId, int order) {
        return shuffleRepository.findCardByUserIdAndCardOrder(userId, order)
                .orElseThrow(() -> new NoSuchElementException("Card not found"));
    }

    private List<Integer> getShuffledCardIds() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);
        return cardIds;
    }
}