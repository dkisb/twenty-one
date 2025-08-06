package com.codecool.huszonegy.backend.model;

public record UserDTO(String username, int playedGames, int wonGames, int lostGames, int playerBalance) {
}
