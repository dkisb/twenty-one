package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.repository.CardRepository;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ShuffleServiceShufflingTest {
    @Test
    void getShuffledCardIndexes_shouldReturnDeterministicOrderWithFixedSeed() {
        // Arrange
        ShuffleRepository shuffleRepository = Mockito.mock(ShuffleRepository.class);
        CardRepository cardRepository = Mockito.mock(CardRepository.class);
        Random seededRandom = new Random(32);
        ShuffleService service = new ShuffleService(shuffleRepository, cardRepository, seededRandom);

        List<Integer> result = service.getShuffledCardIndexes();
        List<Integer> expected = Arrays.asList(
                18, 10, 21, 23, 16, 2, 8, 13, 11, 30, 12, 19, 22, 14, 25, 28,
                3, 5, 4, 7, 29, 20, 27, 1, 26, 17, 9, 32, 31, 6, 15, 24
        );
        assertEquals(expected, result);
    }
}
