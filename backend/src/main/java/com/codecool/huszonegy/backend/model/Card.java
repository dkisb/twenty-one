package com.codecool.huszonegy.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Base64;


@Getter
@Setter
public class Card {
    private int id;
    private String name;
    private String color;
    private int value;
    private String frontImagePath;

    public Card(String name, String color, int value, String frontImageData) {
        this.name = name;
        this.color = color;
        this.value = value;
        this.frontImagePath = frontImageData;
    }
}

