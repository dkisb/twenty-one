package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.model.entity.Shuffle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShuffleRepository extends JpaRepository<Shuffle, Integer> {
    @Query("SELECT s.card FROM Shuffle s WHERE s.userId = :userId AND s.cardOrder = :cardOrder")
    Optional<Card> findCardByUserIdAndCardOrder(@Param("userId") int userId, @Param("cardOrder") int cardOrder);

    //@Modifying
    //@Transactional
    void deleteByUserId(int userId);

}