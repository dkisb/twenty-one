package com.codecool.huszonegy.backend.repository;

public interface ShuffleDao {
    void insertShuffledCard(int cardId, int userId, int order);
}
