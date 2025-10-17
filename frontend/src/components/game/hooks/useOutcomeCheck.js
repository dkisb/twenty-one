import toast from 'react-hot-toast';
import { useGame } from '../../../context/GameContext/GameContext';
import { useDrawCard } from '../../api/shuffleApi';
import { useUpdateUserStats, getUserProfile } from '../../api/userApi';
import { useUser } from '../../../context/UserContext';

export function useOutcomeCheck(modalRef, setOutcomeMessage) {
  const {
    state,
    yourHandValue,
    addDealerCard,
    setEnoughReached,
    setGameOver,
    setDealerBalance,
    setTotalBet,
  } = useGame();
  const { setUser } = useUser();
  const drawCard = useDrawCard();
  const updateUserStats = useUpdateUserStats();

  function determineOutcome(finalDealerValue, finalPlayerValue, dealerHandLength, playerHandLength) {
    const dealerBust = finalDealerValue >= 22 && dealerHandLength > 2;
    const playerBust = finalPlayerValue >= 22 && playerHandLength > 2;
    const dealerBlackjack = finalDealerValue === 22 && dealerHandLength === 2;
    const playerBlackjack = finalPlayerValue === 22 && playerHandLength === 2;

    if (dealerBust) return { winner: 'player', message: 'Congratulations, you won!' };
    if (playerBust) return { winner: 'dealer', message: 'Sorry, you lost!' };
    if (playerBlackjack) return { winner: 'player', message: 'FIRE! Congratulations, you won!' };
    if (dealerBlackjack) return { winner: 'dealer', message: 'FIRE! Sorry, you lost!' };

    if (finalDealerValue >= finalPlayerValue && finalDealerValue < 22) {
      return { winner: 'dealer', message: 'Sorry, you lost!' };
    }
    if (finalDealerValue < finalPlayerValue) {
      return { winner: 'player', message: 'Congratulations, you won!' };
    }

    return { winner: null, message: '' };
  }

  async function dealAndCheckOutcome() {
    let i = state.nextCardInOrder;
    let dealerValue = state.dealerHand.reduce((sum, card) => sum + card.value, 0);
    let dealerHandLength = state.dealerHand.length;
    const threshold = 15;

    try {
      while (dealerValue < threshold) {
        const card = await drawCard.mutateAsync(i);
        addDealerCard(card);
        dealerValue += card.value;
        dealerHandLength++;
        i++;
        await new Promise((r) => setTimeout(r, 1000));
      }

      setEnoughReached();

      const finalDealerValue = dealerValue;
      const finalPlayerValue = yourHandValue;
      const playerHandLength = state.yourHand.length;
      const { winner, message } = determineOutcome(
          finalDealerValue,
          finalPlayerValue,
          dealerHandLength,
          playerHandLength
      );

      if (!winner) return;

      setGameOver(winner);
      setOutcomeMessage(message);

      /* ========= 🧮 BALANCE MUTATION SECTION ========= */
      const pot = state.totalBet;
      let newDealerBalance = state.dealerBalance;

      if (winner === 'dealer') {
        newDealerBalance += pot;
      }

      // ✅ Only modify dealer balance UI; do NOT touch player or user context here
      setDealerBalance(newDealerBalance);
      setTotalBet(0);

      /* ========= 🧾 BACKEND UPDATE ========= */
      const playerWon = winner === 'player';
      const netChange = pot / 2; // half the pot = actual stake
      const winnings = playerWon ? netChange : -netChange;

      const updatePayload = {
        addGame: 1,
        addWin: playerWon ? 1 : 0,
        addLose: playerWon ? 0 : 1,
        addWinnings: winnings,
      };

      await updateUserStats.mutateAsync(updatePayload);
      const updatedUser = await getUserProfile();
      setUser(updatedUser);

      setTimeout(() => modalRef.current?.showModal(), 100);
    } catch (err) {
      console.error('Dealer loop failed:', err);
      toast.error('An error occurred during the game. Please try again');
    }
  }

  async function checkPlayerBustImmediate(hand, value) {
    // FIRE: 22 with only 2 cards → instant win
    if (value === 22 && hand.length === 2) {
      setGameOver('player');
      setOutcomeMessage('FIRE! Congratulations, you won!');

      const pot = state.totalBet;
      setTotalBet(0);

      const winnings = pot / 2;

      const updatePayload = {
        addGame: 1,
        addWin: 1,
        addLose: 0,
        addWinnings: winnings,
      };

      await updateUserStats.mutateAsync(updatePayload);
      const updatedUser = await getUserProfile();
      setUser(updatedUser);

      setTimeout(() => modalRef.current?.showModal(), 100);
      return;
    }

    // bust detection - 22+ with more than 2 cards
    if (value >= 22 && hand.length > 2) {
      setGameOver('dealer');
      setOutcomeMessage('Sorry, you lost!');

      const pot = state.totalBet;
      setTotalBet(0);

      const updatePayload = {
        addGame: 1,
        addWin: 0,
        addLose: 1,
        addWinnings: -(pot / 2),
      };

      await updateUserStats.mutateAsync(updatePayload);
      const updatedUser = await getUserProfile();
      setUser(updatedUser);

      setTimeout(() => modalRef.current?.showModal(), 100);
    }
  }

  return { dealAndCheckOutcome, checkPlayerBustImmediate };
}