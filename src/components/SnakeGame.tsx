import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction, GameState } from '../types';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const DEFAULT_SPEED = 150;

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState('PLAYING');
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': 
          if (gameState === 'PLAYING') setGameState('PAUSED');
          else if (gameState === 'PAUSED') setGameState('PLAYING');
          else if (gameState === 'START' || gameState === 'GAME_OVER') resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (gameState === 'PLAYING') {
        const elapsed = timestamp - lastUpdateRef.current;
        const speed = Math.max(80, DEFAULT_SPEED - Math.floor(score / 50) * 5);

        if (elapsed > speed) {
          moveSnake();
          lastUpdateRef.current = timestamp;
        }
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, moveSnake, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      
      const x = segment.x * size + 1;
      const y = segment.y * size + 1;
      const w = size - 2;
      const h = size - 2;
      
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 4);
      ctx.fill();
    });

    if (score > highScore) setHighScore(score);
  }, [snake, food, score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-sm px-2">
        <div className="flex items-center gap-3 px-4 py-2 glass-morphism rounded-xl border-dashed border-2 border-neon-blue/30 overflow-hidden relative group">
          <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-zinc-500 uppercase tracking-[0.3em] text-[9px] font-bold">Score</span>
          <span className="text-neon-blue font-digital font-bold text-3xl animate-glitch relative z-10">
            {score.toString().padStart(3, '0')}
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 glass-morphism rounded-xl border border-white/10 overflow-hidden group">
          <Trophy className="w-4 h-4 text-neon-pink group-hover:animate-bounce" />
          <div className="flex flex-col">
            <span className="text-zinc-500 uppercase tracking-[0.3em] text-[8px] font-bold">Best Record</span>
            <span className="text-neon-pink font-digital font-bold text-2xl tracking-tighter">
              {highScore.toString().padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-pink opacity-20 group-hover:opacity-40 blur-lg transition duration-1000 group-hover:duration-200"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative glass-morphism rounded-xl shadow-2xl cursor-none"
          style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}
        />

        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40"
            >
              <div className="text-center p-8 glass-morphism rounded-2xl border border-white/20">
                {gameState === 'START' && (
                  <>
                    <h2 className="text-3xl font-bold mb-2 tracking-tighter italic">READY?</h2>
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mb-6">Use Arrows to Move</p>
                    <button
                      onClick={resetGame}
                      className="group relative px-6 py-2 bg-neon-blue text-black font-bold text-sm tracking-widest rounded-full hover:scale-105 transition active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4" /> START MISSION
                      </div>
                    </button>
                  </>
                )}
                {gameState === 'PAUSED' && (
                  <>
                    <h2 className="text-3xl font-bold mb-2 tracking-tighter italic neon-glow-blue">PAUSED</h2>
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mb-6">Press Space to Resume</p>
                    <button
                      onClick={() => setGameState('PLAYING')}
                      className="group relative px-6 py-2 bg-neon-blue text-black font-bold text-sm tracking-widest rounded-full"
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 fill-current" /> RESUME
                      </div>
                    </button>
                  </>
                )}
                {gameState === 'GAME_OVER' && (
                  <>
                    <h2 className="text-3xl font-bold mb-1 tracking-tighter italic text-red-500">FAILED</h2>
                    <div className="mb-6">
                       <div className="text-7xl font-bold tracking-tighter neon-glow-pink mb-2">{score}</div>
                       <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">Final Evaluation</p>
                    </div>
                    <button
                      onClick={resetGame}
                      className="group relative px-6 py-2 bg-neon-pink text-white font-bold text-sm tracking-widest rounded-full hover:scale-105 transition"
                    >
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> REBOOT
                      </div>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_5px_#00ffff]" />
            Snake
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_5px_#ff00ff]" />
            Target
          </div>
      </div>
    </div>
  );
};
