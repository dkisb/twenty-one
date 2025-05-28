package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
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

    private final CardDao cardDao;

    public CardService(CardDao cardDao) {
        this.cardDao = cardDao;
    }

    public void generateAllCards() throws Exception {
        List<String> names = List.of("unter", "ober", "king", "seven", "eight", "nine", "ten", "ace");
        List<Integer> values = List.of(2, 3, 4, 7, 8, 9, 10, 11);
        List<String> colors = List.of("acorn", "bell", "heart", "leaf");

        int cardNumber = 1;
        for (String color : colors) {
            for (int i = 0; i < names.size(); i++) {
                String name = names.get(i);
                int value = values.get(i);

                String number = String.format("%02d", cardNumber);
                String filename = number + color + "-" + name + ".png";
                Path frontPath = Path.of("images", filename);

                byte[] frontImage = Files.readAllBytes(frontPath);

                Card card = new Card(name, color, value, frontImage);
                cardDao.addCard(card);

                cardNumber++;
            }
        }
        System.out.println("✅ All 32 cards inserted.");
    }

    public List<Integer> getShuffledCardIds() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);

        return cardIds;
    }

}
