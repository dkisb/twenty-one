package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.model.Card;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@Repository
public class CardDaoJdbc implements CardDao {
    private final DataSource dataSource;

    public CardDaoJdbc(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void addCard(Card card) {
        String sql = "INSERT INTO cards (name, color, value, front_image_path) VALUES (?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, card.getName());
            stmt.setString(2, card.getColor());
            stmt.setInt(3, card.getValue());
            stmt.setString(4, card.getFrontImagePath());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
