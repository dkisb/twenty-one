package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.repository.ShuffleDao;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShuffleServiceTest {

    @Mock
    private CardService cardServiceMock;

    @Mock
    private ShuffleDao shuffleDaoMock;

    @InjectMocks
    private ShuffleService shuffleService;

    @Test
    void addShuffledDeck_shouldInsertCardsInCorrectOrder() {
        int userId = 1;
        List<Integer> shuffledCardIds = Arrays.asList(5, 10, 15);
        when(cardServiceMock.getShuffledCardIds()).thenReturn(shuffledCardIds);

        shuffleService.addShuffledDeck(userId);

        verify(shuffleDaoMock).insertShuffledCard(5, userId, 1);
        verify(shuffleDaoMock).insertShuffledCard(10, userId, 2);
        verify(shuffleDaoMock).insertShuffledCard(15, userId, 3);
    }

    @Test
    void getNextCardFromDeck_shouldReturnCorrectCard() {
        int userId = 2;
        int order = 1;
        Card card = new Card("king", "bell", 7, "11bell-king.png");
        when(shuffleDaoMock.getNextCardInLine(order, userId)).thenReturn(card);

        Card result = shuffleService.getNextCardFromDeck(userId, order);

        assertEquals(card, result);
    }

    @Test
    void addShuffledDeck_shouldNotInsertIfNoCards() {
        int userId = 3;
        when(cardServiceMock.getShuffledCardIds()).thenReturn(Collections.emptyList());

        shuffleService.addShuffledDeck(userId);

        verify(shuffleDaoMock, never()).insertShuffledCard(anyInt(), anyInt(), anyInt());
    }
}
