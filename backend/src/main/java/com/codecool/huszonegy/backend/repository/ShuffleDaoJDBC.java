package com.codecool.huszonegy.backend.repository;


import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.model.User;
import com.codecool.huszonegy.backend.service.CardService;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

@Repository
public class ShuffleDaoJDBC implements ShuffleDao {
    private final DataSource dataSource;

    public ShuffleDaoJDBC(DataSource dataSource) {
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

    @Override
    public Card getNextCardInLine(int order, int userId) {
        String sql = """
        SELECT c.id, c.name, c.color, c.value, c.front_image
        FROM shuffles s
        JOIN cards c ON s.card_id = c.id
        WHERE s.user_id = ? AND s.card_order = ?
    """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            stmt.setInt(2, order);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Card card = new Card(
                        rs.getString("name"),
                        rs.getString("color"),
                        rs.getInt("value"),
                        rs.getBytes("front_image")
                );
                card.setId(rs.getInt("id"));
                return card;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get next card in line", e);
        }

        return null;
    }}

