import { useGame } from '../../../context/GameContext/GameContext';
import { useUser } from '../../../context/UserContext';

function DisplayBalances({ type }) {
  const { state } = useGame();
  const { user } = useUser();

  const balanceData = {
    dealer: {
      label: "Dealer",
      value: state.dealerBalance,
      alt: "Dealer poker chips"
    },
    pot: {
      label: "Total Pot",
      value: state.totalBet,
      alt: "Total bet chips"
    },
    player: {
      label: user?.username || 'Player',
      value: user.playerBalance ?? 0,
      alt: "Player poker chips"
    }
  };

  const item = balanceData[type];
  if (!item) return null;

  return (
    <div className="flex flex-col items-start gap-0.5 sm:gap-1 md:gap-1.5">
      <img
        src="/chips.png"
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain"
        alt={item.alt}
      />
      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-left leading-tight">
        {item.label}
      </p>
      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-left leading-tight">
        ${item.value}
      </p>
    </div>
  );
}

export default DisplayBalances;