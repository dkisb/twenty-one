package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.cards.Card;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface CardDao {

    void addCard(Card card);
    Optional<Card> findCardById(int id) throws SQLException;
}
