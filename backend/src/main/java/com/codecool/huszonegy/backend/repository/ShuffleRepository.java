package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.model.Shuffle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ShuffleRepository extends JpaRepository<Shuffle, Integer> {
    @Query("SELECT s.card FROM Shuffle s WHERE s.userId = :userId AND s.cardOrder = :cardOrder")
    Optional<Card> findCardByUserIdAndCardOrder(@Param("userId") int userId, @Param("cardOrder") int cardOrder);

    @Modifying
    @Transactional
    @Query(
            value = "INSERT INTO shuffles (user_id, card_order, card_id) VALUES (:userId, :cardOrder, :cardId)",
            nativeQuery = true
    )
    void insertShuffledCard(@Param("userId") int userId, @Param("cardOrder") int cardOrder, @Param("cardId") int cardId);
}