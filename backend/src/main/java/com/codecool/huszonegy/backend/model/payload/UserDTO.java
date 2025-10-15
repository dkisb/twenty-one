package com.codecool.huszonegy.backend.model.payload;

public record UserDTO(String username, int playedGames, int wonGames, int lostGames, int playerBalance) {
}
