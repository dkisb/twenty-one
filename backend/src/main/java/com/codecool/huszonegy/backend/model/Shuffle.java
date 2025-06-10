package com.codecool.huszonegy.backend.model;

import jakarta.persistence.*;

@Entity
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
}

