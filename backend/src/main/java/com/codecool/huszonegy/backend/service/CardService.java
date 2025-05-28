package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.cards.Card;
import com.codecool.huszonegy.backend.repository.CardDao;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class CardService {

    private final CardDao repository;

    public CardService(CardDao repository) {
        this.repository = repository;
    }

    private void generateAllCards() throws Exception {
        List<String> names = List.of("unter", "ober", "king", "seven", "eight", "nine", "ten", "ace");
        List<Integer> values = List.of(2, 3, 4, 7, 8, 9, 10, 11);
        List<String> colors = List.of("acorn", "bell", "heart", "leaf");

        byte[] backImage = Files.readAllBytes(Path.of("images/Back.jpg"));

        int cardNumber = 1;
        for (String color : colors) {
            for (int i = 0; i < names.size(); i++) {
                String name = names.get(i);
                int value = values.get(i);

                String number = String.format("%02d", cardNumber);
                String filename = number + color + "-" + name + ".png";
                Path frontPath = Path.of("images", filename);

                byte[] frontImage = Files.readAllBytes(frontPath);

                Card card = new Card(name, color, value, frontImage, backImage);
                repository.addCard(card);

                cardNumber++;
            }
        }
        System.out.println("✅ All 32 cards inserted.");
    }

    private List<Integer> getShuffledCardIds() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);

        return cardIds;
    }

    public List<Card> getShuffledDeck() throws SQLException {
        List<Integer> shuffledIds = getShuffledCardIds();

        List<Card> cards = new ArrayList<>();
        for (int id : shuffledIds) {
            Optional<Card> optionalCard = repository.findCardById(id);
            if (optionalCard.isEmpty()) {
                throw new IllegalStateException("Card with ID " + id + " not found!");
            }
            cards.add(optionalCard.get());
        }
        return cards;
    }
}
