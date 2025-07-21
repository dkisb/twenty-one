package com.codecool.huszonegy.backend.model.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String password;
    private String email;
    private int playedGames = 0;
    private int wonGames = 0;
    private int lostGames = 0;
    private int creditBalance = 0;

}
