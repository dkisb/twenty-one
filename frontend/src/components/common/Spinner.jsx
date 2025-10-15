import heartSvg from '../../assets/heart.svg';
import leafSvg from '../../assets/leaf.svg';
import bellSvg from '../../assets/bell.svg';
import acornSvg from '../../assets/acorn.svg';

export default function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-table-background text-white">
      <div className="relative w-24 h-24 flex items-center justify-center animate-spin-slow">
        <img
          src={heartSvg}
          alt="heart"
          className="absolute w-12 opacity-90 rotate-12"
        />
        <img
          src={leafSvg}
          alt="leaf"
          className="absolute w-10 opacity-80 -rotate-12"
        />
        <img
          src={bellSvg}
          alt="bell"
          className="absolute w-10 opacity-80 translate-x-4 -translate-y-3 rotate-[25deg]"
        />
        <img
          src={acornSvg}
          alt="acorn"
          className="absolute w-10 opacity-80 -translate-x-4 translate-y-3 -rotate-[25deg]"
        />
      </div>
      <p className="mt-6 text-lg font-semibold text-white drop-shadow-sm">
        Shuffling the deck...
      </p>
    </div>
  );
}