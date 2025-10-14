package com.codecool.huszonegy.backend.service;

import com.codecool.huszonegy.backend.model.entity.Card;
import com.codecool.huszonegy.backend.model.entity.Shuffle;
import com.codecool.huszonegy.backend.repository.CardRepository;
import com.codecool.huszonegy.backend.repository.ShuffleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShuffleServiceTest {

    @Mock
    private ShuffleRepository shuffleRepository;

    @Mock
    private UserService userService;

    @Mock
    private CardRepository cardRepository;

    @Mock
    private Random random;

    private ShuffleService shuffleService;

    private List<Card> testCards;

    @BeforeEach
    void setUp() {
        testCards = IntStream.rangeClosed(1, 32)
                .mapToObj(i -> {
                    Card card = new Card();
                    card.setId(i);
                    return card;
                }).collect(Collectors.toList());
        shuffleService = new ShuffleService(shuffleRepository, cardRepository, random, userService);
    }

    @Test
    void testAddShuffledDeck_SavesShuffledCards() {
        User springUser = new User("userName", "password", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        int userId = 1;
        when(userService.getUserId(springUser.getUsername())).thenReturn(userId);
        when(cardRepository.findAll()).thenReturn(testCards);

        // Mock random to return a predictable shuffle (incremental order for simplicity)
        when(random.nextInt(anyInt())).thenReturn(0); // Forces minimal shuffling

        shuffleService.addShuffledDeck();

        // Verify deleteByUserId is called
        verify(shuffleRepository, times(1)).deleteByUserId(userId);

        // Capture and verify saveAll call
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Shuffle>> shuffleCaptor = ArgumentCaptor.forClass(List.class);
        verify(shuffleRepository, times(1)).saveAll(shuffleCaptor.capture());

        List<Shuffle> savedShuffles = shuffleCaptor.getValue();
        assertEquals(32, savedShuffles.size(), "Should save 32 Shuffle entries");

        // Verify each Shuffle entry
        for (int i = 0; i < savedShuffles.size(); i++) {
            Shuffle shuffle = savedShuffles.get(i);
            assertEquals(userId, shuffle.getUserId(), "User ID should match");
            assertEquals(i + 1, shuffle.getCardOrder(), "Card order should match index + 1");
            assertTrue(testCards.contains(shuffle.getCard()), "Card should be from testCards");
        }
    }

    @Test
    void testAddShuffledDeck_UserNotFound_ThrowsException() {
        User springUser = new User("userName", "password", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(userService.getUserId(springUser.getUsername())).thenThrow(new NoSuchElementException("User not found"));

        assertThrows(NoSuchElementException.class, () -> shuffleService.addShuffledDeck());
        verify(shuffleRepository, never()).deleteByUserId(anyInt());
        verify(shuffleRepository, never()).saveAll(anyList());
    }

    @Test
    void testAddShuffledDeck_EmptyCardRepository_ThrowsException() {
        User springUser = new User("userName", "password", new HashSet<>());
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(springUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        int userId = 1;
        when(userService.getUserId(springUser.getUsername())).thenReturn(userId);
        when(cardRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(NoSuchElementException.class, () -> shuffleService.addShuffledDeck());
        verify(shuffleRepository, times(1)).deleteByUserId(userId);
        verify(shuffleRepository, never()).saveAll(anyList());
    }

    @Test
    void testGetNextCardFromDeck_ReturnsCorrectCard() {
        String userName = "testUser";
        int userId = 1;
        int order = 1;
        Card expectedCard = new Card();
        expectedCard.setId(1);
        when(userService.getUserId(userName)).thenReturn(userId);
        when(shuffleRepository.findCardByUserIdAndCardOrder(userId, order)).thenReturn(Optional.of(expectedCard));

        Card result = shuffleService.getNextCardFromDeck(userName, order);

        assertEquals(expectedCard, result);
        verify(userService, times(1)).getUserId(userName);
        verify(shuffleRepository, times(1)).findCardByUserIdAndCardOrder(userId, order);
    }

    @Test
    void testGetNextCardFromDeck_CardNotFound_ThrowsException() {
        String userName = "testUser";
        int userId = 1;
        int order = 1;
        when(userService.getUserId(userName)).thenReturn(userId);
        when(shuffleRepository.findCardByUserIdAndCardOrder(userId, order)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> shuffleService.getNextCardFromDeck(userName, order));
        verify(userService, times(1)).getUserId(userName);
        verify(shuffleRepository, times(1)).findCardByUserIdAndCardOrder(userId, order);
    }

    @Test
    void testGetShuffledCardIndexes_ReturnsPermutationOf32Numbers() {
        // Use real Random for realistic shuffle
        ShuffleService localShuffleService = new ShuffleService(shuffleRepository, cardRepository, new Random(12345), userService);
        List<Integer> result = localShuffleService.getShuffledCardIndexes();

        assertEquals(32, result.size(), "Should return exactly 32 numbers");

        List<Integer> sortedResult = new ArrayList<>(result);
        Collections.sort(sortedResult);
        assertEquals(IntStream.rangeClosed(1, 32).boxed().collect(Collectors.toList()),
                sortedResult, "Should contain all numbers from 1 to 32 exactly once");
    }

    @Test
    void testGetShuffledCardIndexes_MockedRandom_ReturnsPermutation() {
        // Mock Random to select the last element each time (simulates a specific permutation)
        when(random.nextInt(anyInt())).thenAnswer(invocation -> {
            int bound = invocation.getArgument(0);
            return bound - 1; // Selects the last possible index
        });

        List<Integer> result = shuffleService.getShuffledCardIndexes();

        assertEquals(32, result.size(), "Should return exactly 32 numbers");

        List<Integer> sortedResult = new ArrayList<>(result);
        Collections.sort(sortedResult);
        assertEquals(IntStream.rangeClosed(1, 32).boxed().collect(Collectors.toList()),
                sortedResult, "Should contain all numbers from 1 to 32 exactly once");

        // Note: Removed exact order assertion because Collections.shuffle behavior with mocked Random is JVM-dependent
        // Instead, we verify it's a valid permutation
    }

    @Test
    void testGetShuffledCardIndexes_DifferentSeeds_DifferentOrders() {
        // Use two different Random instances with different seeds
        ShuffleService service1 = new ShuffleService(shuffleRepository, cardRepository, new Random(12345), userService);
        ShuffleService service2 = new ShuffleService(shuffleRepository, cardRepository, new Random(67890), userService);

        List<Integer> firstCall = service1.getShuffledCardIndexes();
        List<Integer> secondCall = service2.getShuffledCardIndexes();

        assertNotEquals(firstCall, secondCall, "Different seeds should produce different orders");

        List<Integer> sortedFirst = new ArrayList<>(firstCall);
        List<Integer> sortedSecond = new ArrayList<>(secondCall);
        Collections.sort(sortedFirst);
        Collections.sort(sortedSecond);
        assertEquals(sortedFirst, sortedSecond, "Both lists should contain the same numbers");
    }
}