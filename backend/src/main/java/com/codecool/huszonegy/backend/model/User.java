package com.codecool.huszonegy.backend.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private int playedGames;
    private int wonGames;
    private int lostGames;
    private int creditBalance;

    public User (String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.playedGames = 0;
        this.wonGames = 0;
        this.lostGames = 0;
        this.creditBalance = 0;
    }
}
