package com.codecool.huszonegy.backend.repository;


import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.model.User;
import com.codecool.huszonegy.backend.service.CardService;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class ShuffleDaoJDBC implements ShuffleDao {
    private final DataSource dataSource;

    public ShuffleDaoJDBC(DataSource dataSource, CardService cardService) {
        this.dataSource = dataSource;
    }

    @Override
    public void insertShuffledCard(int cardId, int userId, int order){
        String sql = "INSERT INTO shuffles (card_id, user_id, card_order) VALUES (?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, cardId);
            stmt.setInt(2, userId);
            stmt.setInt(3, order);

            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
