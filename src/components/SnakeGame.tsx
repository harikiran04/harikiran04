import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div 
        className="relative grid bg-slate-950 border border-slate-800"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {/* Snake rendering */}
        {snake.map((p, i) => (
          <motion.div
            key={`${i}-${p.x}-${p.y}`}
            className={`absolute ${i === 0 ? 'bg-white z-10' : 'bg-cyan-500'} border border-slate-950`}
            initial={false}
            animate={{ 
              left: `${(p.x / GRID_SIZE) * 100}%`,
              top: `${(p.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              boxShadow: i === 0 ? '0 0 10px #fff' : '0 0 5px #06b6d4'
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        ))}

        {/* Food rendering */}
        <motion.div
          className="absolute bg-rose-500 rounded-full"
          animate={{ 
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            scale: [1, 1.2, 1],
            boxShadow: ['0 0 5px #f43f5e', '0 0 15px #f43f5e', '0 0 5px #f43f5e']
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      <AnimatePresence>
        {(isGameOver || isPaused) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6 text-center z-20"
          >
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-bold text-rose-500 mb-4 drop-shadow-[0_0_10px_#f43f5e]">GAME OVER</h2>
                <p className="text-cyan-400 mb-6 text-lg tracking-widest">FINAL SCORE: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  REBOOT CORE
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_10px_#22d3ee]">STASIS ACTIVE</h2>
                <p className="text-slate-400 mb-8 italic">Press SPACE or button to engage</p>
                <button 
                   onClick={() => setIsPaused(false)}
                   className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  ENGAGE
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex gap-4 w-full">
        <div className="flex-1 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
           <span className="text-xs text-slate-500 block uppercase tracking-tighter">Velocity Score</span>
           <span className="text-2xl font-mono text-cyan-400 leading-none">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col justify-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Arrows to pilot</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Space to pause</p>
        </div>
      </div>
    </div>
  );
}
