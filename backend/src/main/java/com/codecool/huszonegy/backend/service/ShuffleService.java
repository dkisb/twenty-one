package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.model.Shuffle;
import com.codecool.huszonegy.backend.repository.CardRepository;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ShuffleService {
    private final ShuffleRepository shuffleRepository;
    private final CardRepository cardRepository;
    private Random random;

    public ShuffleService(ShuffleRepository shuffleRepository, CardRepository cardRepository, Random random) {
        this.shuffleRepository = shuffleRepository;
        this.cardRepository = cardRepository;
        this.random = random;
    }

    public void addShuffledDeck(int userId) {
        shuffleRepository.deleteByUserId(userId);
        List<Integer> shuffledCardIndexes = getShuffledCardIndexes();
        List<Shuffle> cardsToSave = new ArrayList<>();
        List<Card> allCards = cardRepository.findAll();
        for (int i = 0; i < shuffledCardIndexes.size(); i++) {
            int carCardServicedId = shuffledCardIndexes.get(i);
            Card card = allCards.stream().filter(e -> e.getId() == carCardServicedId).findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Card not found"));
            cardsToSave.add(new Shuffle(card, userId, i + 1));
        }
        shuffleRepository.saveAll(cardsToSave);
    }

    public Card getNextCardFromDeck(int userId, int order) {
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