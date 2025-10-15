import heartSvg from '../../assets/heart.svg';
import leafSvg from '../../assets/leaf.svg';
import bellSvg from '../../assets/bell.svg';
import acornSvg from '../../assets/acorn.svg';

export default function ErrorPage({ error }) {
  const status = error?.status || '404';
  const message = error?.message || 'The page you’re looking for has gone missing...';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-poker-table text-white relative overflow-hidden px-4">
      {/* Decorative suits */}
      <img
        src={heartSvg}
        alt="heart"
        className="absolute top-6 left-6 w-20 md:w-24 opacity-60 rotate-6 pointer-events-none"
      />
      <img
        src={acornSvg}
        alt="acorn"
        className="absolute top-10 right-10 w-20 md:w-24 opacity-60 -rotate-12 pointer-events-none"
      />
      <img
        src={bellSvg}
        alt="bell"
        className="absolute bottom-12 left-10 w-20 md:w-24 opacity-60 rotate-12 pointer-events-none"
      />
      <img
        src={leafSvg}
        alt="leaf"
        className="absolute bottom-8 right-8 w-20 md:w-24 opacity-60 -rotate-6 pointer-events-none"
      />
      {/* Message */}
      <h1 className="text-5xl font-extrabold text-white drop-shadow-md mb-4">
        {status}
      </h1>
      <p className="text-xl font-medium text-gray-200 text-center max-w-xl mb-6">
        {message}
      </p>
      <button
        onClick={() => (window.location.href = '/')}
        className="btn btn-primary px-6 py-2 text-lg font-semibold rounded-lg shadow-md"
      >
        Return to Safe Zone 🃏
      </button>
    </div>
  );
}