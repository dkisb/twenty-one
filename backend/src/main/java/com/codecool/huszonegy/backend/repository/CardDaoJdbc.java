package com.codecool.huszonegy.backend.repository;

import com.codecool.huszonegy.backend.cards.Card;
import org.springframework.stereotype.Repository;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Repository
public class CardDaoJdbc implements CardDao {
    private final DataSource dataSource;

    public CardDaoJdbc(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void addCard(Card card) {
        String sql = "INSERT INTO cards (name, color, value, front_image, back_image) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, card.getName());
            stmt.setString(2, card.getColor());
            stmt.setInt(3, card.getValue());
            stmt.setBytes(4, card.getFrontImageData());
            stmt.setBytes(5, card.getBackImageData());
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<Card> findCardById(int id) throws SQLException {
        String sql = "SELECT * FROM cards WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Card card = new Card(
                        rs.getString("name"),
                        rs.getString("color"),
                        rs.getInt("value"),
                        rs.getBytes("front_image"),
                        rs.getBytes("back_image")
                );
                card.setId(rs.getInt("id"));
                return Optional.of(card);
            }
            return Optional.empty();
        }
    }

    public List<Integer> getShuffledCardIds() {
        List<Integer> cardIds = IntStream.rangeClosed(1, 32)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(cardIds);
        cardIds.forEach(id -> System.out.print(id + " "));

        return cardIds;
    }
    @Override
    public List<Card> getShuffledDeck() throws SQLException {
        List<Integer> shuffledIds = getShuffledCardIds();

        List<Card> cards = new ArrayList<>();
        for (int id : shuffledIds) {
            Optional<Card> optionalCard = findCardById(id);
            if (optionalCard.isEmpty()) {
                throw new IllegalStateException("Card with ID " + id + " not found!");
            }
            cards.add(optionalCard.get());
        }
        return cards;
    }

}
