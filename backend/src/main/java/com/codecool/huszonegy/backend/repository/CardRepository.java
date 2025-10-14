package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.model.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Integer> {
}