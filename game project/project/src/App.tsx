import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw, Heart } from 'lucide-react';

type Card = {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const symbols = ['🌟', '🌙', '⚡', '🔮', '🎭', '🗝️', '🕯️', '🪄'];

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [lives, setLives] = useState(5);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedSymbols = [...symbols, ...symbols];
    const shuffledCards = duplicatedSymbols
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);
    setLives(5);
  };

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length === 2 ||
      cards[cardId].isFlipped ||
      cards[cardId].isMatched ||
      lives === 0
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards;

      if (cards[firstCard].symbol === cards[secondCard].symbol) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstCard].isMatched = true;
          matchedCards[secondCard].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setScore(score + 10);

          // Check if game is won
          if (matchedCards.every(card => card.isMatched)) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstCard].isFlipped = false;
          resetCards[secondCard].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setLives(lives - 1);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" />
            Magic Match
          </h1>
          <div className="flex justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Score:</span>
              <span className="bg-indigo-700 px-3 py-1 rounded-full">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Moves:</span>
              <span className="bg-indigo-700 px-3 py-1 rounded-full">{moves}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-red-500" />
              <span className="bg-indigo-700 px-3 py-1 rounded-full">{lives}</span>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-indigo-600 rotate-0'
                  : 'bg-indigo-400 rotate-y-180'
              } ${
                card.isMatched
                  ? 'bg-green-600'
                  : ''
              } hover:scale-105 disabled:opacity-50`}
              disabled={lives === 0 || gameWon}
            >
              {(card.isFlipped || card.isMatched) && (
                <span className="transform">{card.symbol}</span>
              )}
            </button>
          ))}
        </div>

        {/* Game Status */}
        {(gameWon || lives === 0) && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {gameWon ? '🎉 Congratulations! You Won! 🎉' : '😢 Game Over!'}
            </h2>
            <button
              onClick={initializeGame}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-indigo-700 transition"
            >
              <RefreshCcw size={20} />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;