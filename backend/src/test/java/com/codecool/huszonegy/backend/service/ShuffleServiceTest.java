package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShuffleServiceTest {

    @Mock
    ShuffleRepository shuffleRepository; //CardRepository nem kell neki

    @InjectMocks
    ShuffleService shuffleService;

    @Test
    void getNextCardFromDeckWhenUserIdAndCardOrderAreCorrect() {
        Card mockCard = Mockito.mock(Card.class);
        when(shuffleRepository.findCardByUserIdAndCardOrder(2, 3)).thenReturn(Optional.of(mockCard));
        Card result = shuffleService.getNextCardFromDeck(2, 3);
        assertEquals(mockCard, result);
    }

    @Test
    void getNullFromDeckWhenRepositoryCannotFindAnyThing() {
        when(shuffleRepository.findCardByUserIdAndCardOrder(2, 3)).thenReturn(Optional.empty());
        RuntimeException exception= assertThrows(RuntimeException.class,()->{
            shuffleService.getNextCardFromDeck(2, 3);
        });
        assertEquals("Card not found", exception.getMessage());
    }
}