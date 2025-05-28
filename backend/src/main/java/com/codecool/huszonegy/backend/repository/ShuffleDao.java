package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.model.Card;

public interface ShuffleDao {
    void insertShuffledCard(int cardId, int userId, int order);
    Card getNextCardInLine(int order, int userId);
}
