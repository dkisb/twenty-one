package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.model.entity.Shuffle;
import com.codecool.huszonegy.backend.repository.CardRepository;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
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
    private final CardRepository cardRepository;

    public ShuffleService(ShuffleRepository shuffleRepository, CardRepository cardRepository) {
        this.shuffleRepository = shuffleRepository;
        this.cardRepository = cardRepository;
    }

    public void addShuffledDeck(int userId) {
        shuffleRepository.deleteByUserId(userId);
        List<Integer> shuffledCardIndexes = getShuffledCardIndexes();
        List<Shuffle> cardsToSave = new ArrayList<>();
        List<Card> allCards = cardRepository.findAll();
        for (int i = 0; i < shuffledCardIndexes.size(); i++) {
            int cardId = shuffledCardIndexes.get(i);
            Card card = allCards.stream().filter(e -> e.getId() == cardId).findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Card not found"));
            cardsToSave.add(new Shuffle(card, userId, i + 1));
        }
        shuffleRepository.saveAll(cardsToSave);
    }

    public Card getNextCardFromDeck(int userId, int order) {
        return shuffleRepository.findCardByUserIdAndCardOrder(userId, order)
                .orElseThrow(() -> new NoSuchElementException("Card not found"));
    }

    private List<Integer> getShuffledCardIndexes() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);
        return cardIds;
    }
}