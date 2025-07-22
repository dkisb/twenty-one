package com.codecool.huszonegy.backend.model.payload;

import com.codecool.huszonegy.backend.model.entity.Roles;

public record JwtResponse(String jwt, String userName, Roles role) {}
