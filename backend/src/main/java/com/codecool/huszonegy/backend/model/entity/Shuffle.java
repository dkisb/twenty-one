package com.codecool.huszonegy.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "shuffles")
public class Shuffle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;
    private int cardOrder;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;

    public Shuffle(Card card, int userId, int cardOrder) {
        this.card = card;
        this.userId = userId;
        this.cardOrder = cardOrder;
    }

    public Shuffle() {}
}