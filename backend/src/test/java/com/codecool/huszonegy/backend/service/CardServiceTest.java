package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.Card;
import com.codecool.huszonegy.backend.repository.CardDao;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock
    private CardDao cardDao;

    @InjectMocks
    private CardService cardService;

    @Test
    void generateAllCards_shouldAdd32CardsToDao() throws Exception {
        cardService.generateAllCards();
        verify(cardDao, times(32)).addCard(any(Card.class));
    }

    @Test
    void generateAllCards_shouldUseCorrectFilenamePattern() throws Exception {
        ArgumentCaptor<Card> captor = ArgumentCaptor.forClass(Card.class);
        cardService.generateAllCards();
        verify(cardDao, times(32)).addCard(captor.capture());
        List<Card> allCards = captor.getAllValues();
        assertTrue(allCards.get(0).getFrontImagePath().matches("\\d{2}[a-z]+-[a-z]+\\.png"));
        assertTrue(allCards.get(31).getFrontImagePath().matches("\\d{2}[a-z]+-[a-z]+\\.png"));
    }

    @Test
    void getShuffledCardIds_shouldReturn32UniqueIds() {
        List<Integer> ids = cardService.getShuffledCardIds();
        assertEquals(32, ids.size());
        Set<Integer> uniqueIds = new HashSet<>(ids);
        assertEquals(32, uniqueIds.size(), "Card IDs should be unique");
        for (Integer id : ids) {
            assertTrue(id >= 1 && id <= 32);
        }
    }
}
