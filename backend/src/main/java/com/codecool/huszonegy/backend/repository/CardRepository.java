package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findCardById(int id);
}
