import { useGame } from '../../../context/GameContext/GameContext';
import { useDrawCard } from '../../api/shuffleApi';
import { useUpdateUserStats, getUserProfile } from '../../api/userApi';
import { useUser } from '../../../context/UserContext';

export function useOutcomeCheck(modalRef, setOutcomeMessage) {
  const { state, yourHandValue, addDealerCard, setEnoughReached, setGameOver } = useGame();
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
    // Deal cards to dealer until threshold
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
      
      // Calculate final values
      const finalDealerValue = dealerValue;
      const finalPlayerValue = yourHandValue;
      const playerHandLength = state.yourHand.length;
      
      // Determine winner
      const { winner, message } = determineOutcome(
        finalDealerValue, 
        finalPlayerValue, 
        dealerHandLength, 
        playerHandLength
      );
      
      if (winner) {
        setGameOver(winner);
        setOutcomeMessage(message);
        
        // Update user stats on backend
        const hasWon = winner === 'player';
        const winnings = hasWon ? state.totalBet : -state.totalBet;
        const updatePayload = {
          addGame: 1,
          addWin: hasWon ? 1 : 0,
          addLose: hasWon ? 0 : 1,
          addWinnings: winnings,
        };
        
        // Update stats and refresh user data
        await updateUserStats.mutateAsync(updatePayload);
        const updatedUser = await getUserProfile();
        setUser(updatedUser);
        
        setTimeout(() => modalRef.current?.showModal(), 100);
      }
    } catch (err) {
      console.error('Dealer loop failed:', err);
    }
  }

  async function checkPlayerBustImmediate(hand, value) {
    if (value >= 22 && hand.length > 2) {
      setGameOver('dealer');
      setOutcomeMessage('Sorry, you lost!');
      const updatePayload = {
        addGame: 1,
        addWin: 0,
        addLose: 1,
        addWinnings: -state.totalBet,
      };
      await updateUserStats.mutateAsync(updatePayload);
      const updatedUser = await getUserProfile();
      setUser(updatedUser);
      setTimeout(() => modalRef.current?.showModal(), 100);
    }
  }

  return { dealAndCheckOutcome, checkPlayerBustImmediate };
}