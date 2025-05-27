package com.codecool.huszonegy.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class ShuffleCards {

    public List<Integer> getShuffledCardIds() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);
        cardIds.forEach(id -> System.out.print(id + " "));

        return cardIds;
    }
}
