package com.codecool.huszonegy.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class Card {
    private int id;
    private String name;
    private String color;
    private int value;
    private byte[] frontImageData;
    private byte[] backImageData;

    public Card(String name, String color, int value, byte[] frontImageData, byte[] backImageData) {
        this.name = name;
        this.color = color;
        this.value = value;
        this.frontImageData = frontImageData;
        this.backImageData = backImageData;
    }
}

