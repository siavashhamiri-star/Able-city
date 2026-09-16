import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Volume2,
  HelpCircle,
  Play,
  Award,
} from 'lucide-react';
import { sounds } from '../lib/sound';

interface MenchGameProps {
  userName: string;
  onAddXp: (amount: number, rep?: number) => void;
  onShowToast: (msg: string) => void;
}

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

interface Token {
  id: number;
  color: PlayerColor;
  // -1: in base
  // 0-39: on main track
  // 100-103: in final winning corridor (goal)
  // 999: reached trophy
  pos: number;
}

interface Player {
  color: PlayerColor;
  name: string;
  isAi: boolean;
  avatar: string;
  startTrackPos: number;
  entryGoalPos: number; // position on main track just before entering corridor
  colorHex: string;
  bgHex: string;
  borderHex: string;
}

const PLAYERS_CONFIG: Record<PlayerColor, Player> = {
  red: {
    color: 'red',
    name: 'شما (قرمز)',
    isAi: false,
    avatar: '🔴',
    startTrackPos: 0,
    entryGoalPos: 39,
    colorHex: '#ef4444',
    bgHex: 'bg-red-500/20',
    borderHex: 'border-red-500',
  },
  green: {
    color: 'green',
    name: 'سهراب (سبز)',
    isAi: true,
    avatar: '🟢',
    startTrackPos: 10,
    entryGoalPos: 9,
    colorHex: '#10b981',
    bgHex: 'bg-emerald-500/20',
    borderHex: 'border-emerald-500',
  },
  yellow: {
    color: 'yellow',
    name: 'شیدا (زرد)',
    isAi: true,
    avatar: '🟡',
    startTrackPos: 20,
    entryGoalPos: 19,
    colorHex: '#eab308',
    bgHex: 'bg-amber-500/20',
    borderHex: 'border-amber-500',
  },
  blue: {
    color: 'blue',
    name: 'کیان (آبی)',
    isAi: true,
    avatar: '🔵',
    startTrackPos: 30,
    entryGoalPos: 29,
    colorHex: '#3b82f6',
    bgHex: 'bg-blue-500/20',
    borderHex: 'border-blue-500',
  },
};

const ORDER: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

// Grid coordinates for the classic 11x11 Mench board
// Main 40-step circuit track mapped to 11x11 board (row, col) from 0 to 10
const TRACK_COORDS: { r: number; c: number }[] = [
  // Red start & right path
  { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, // 0..4
  { r: 3, c: 4 }, { r: 2, c: 4 }, { r: 1, c: 4 }, { r: 0, c: 4 }, // 5..8
  { r: 0, c: 5 }, // 9 (Green entry corner)
  { r: 0, c: 6 }, // 10 (Green start)
  { r: 1, c: 6 }, { r: 2, c: 6 }, { r: 3, c: 6 }, { r: 4, c: 6 }, // 11..14
  { r: 4, c: 7 }, { r: 4, c: 8 }, { r: 4, c: 9 }, { r: 4, c: 10 }, // 15..18
  { r: 5, c: 10 }, // 19 (Yellow entry corner)
  { r: 6, c: 10 }, // 20 (Yellow start)
  { r: 6, c: 9 }, { r: 6, c: 8 }, { r: 6, c: 7 }, { r: 6, c: 6 }, // 21..24
  { r: 7, c: 6 }, { r: 8, c: 6 }, { r: 9, c: 6 }, { r: 10, c: 6 }, // 25..28
  { r: 10, c: 5 }, // 29 (Blue entry corner)
  { r: 10, c: 4 }, // 30 (Blue start)
  { r: 9, c: 4 }, { r: 8, c: 4 }, { r: 7, c: 4 }, { r: 6, c: 4 }, // 31..34
  { r: 6, c: 3 }, { r: 6, c: 2 }, { r: 6, c: 1 }, { r: 6, c: 0 }, // 35..38
  { r: 5, c: 0 }, // 39 (Red entry corner)
];

// Winning corridor tracks (4 steps towards center {r: 5, c: 5})
const CORRIDOR_COORDS: Record<PlayerColor, { r: number; c: number }[]> = {
  red: [{ r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 }],
  green: [{ r: 1, c: 5 }, { r: 2, c: 5 }, { r: 3, c: 5 }, { r: 4, c: 5 }],
  yellow: [{ r: 5, c: 9 }, { r: 5, c: 8 }, { r: 5, c: 7 }, { r: 5, c: 6 }],
  blue: [{ r: 9, c: 5 }, { r: 8, c: 5 }, { r: 7, c: 5 }, { r: 6, c: 5 }],
};

// Bases 2x2 positions
const BASE_COORDS: Record<PlayerColor, { r: number; c: number }[]> = {
  red: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }],
  green: [{ r: 0, c: 9 }, { r: 0, c: 10 }, { r: 1, c: 9 }, { r: 1, c: 10 }],
  yellow: [{ r: 9, c: 9 }, { r: 9, c: 10 }, { r: 10, c: 9 }, { r: 10, c: 10 }],
  blue: [{ r: 9, c: 0 }, { r: 9, c: 1 }, { r: 10, c: 0 }, { r: 10, c: 1 }],
};

export const MenchGame: React.FC<MenchGameProps> = ({ userName, onAddXp, onShowToast }) => {
  const [tokensCount, setTokensCount] = useState<number>(2); // 2 tokens for snappy quick gameplay
  const [tokens, setTokens] = useState<Token[]>([
    { id: 0, color: 'red', pos: -1 },
    { id: 1, color: 'red', pos: -1 },
    { id: 2, color: 'green', pos: -1 },
    { id: 3, color: 'green', pos: -1 },
    { id: 4, color: 'yellow', pos: -1 },
    { id: 5, color: 'yellow', pos: -1 },
    { id: 6, color: 'blue', pos: -1 },
    { id: 7, color: 'blue', pos: -1 },
  ]);

  const [currentTurn, setCurrentTurn] = useState<PlayerColor>('red');
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [gameLog, setGameLog] = useState<string>('بازی آغاز شد! تاس بریزید.');
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [highlightMovable, setHighlightMovable] = useState<number[]>([]);
  const [aiSpeed, setAiSpeed] = useState<number>(700);

  // Roll dice
  const handleRollDice = () => {
    if (isRolling || hasRolled || winner) return;
    setIsRolling(true);
    sounds.playDiceRoll();

    // Visual tumbling
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 6) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setIsRolling(false);
        setHasRolled(true);
        processTurn(finalVal);
      }
    }, 60);
  };

  // Evaluate movable tokens
  const getMovableTokens = (player: PlayerColor, dice: number, currentTokens: Token[]): number[] => {
    const pTokens = currentTokens.filter((t) => t.color === player);
    const movable: number[] = [];

    pTokens.forEach((t) => {
      // In base
      if (t.pos === -1) {
        if (dice === 6) {
          // Can emerge if start pos not blocked by own piece
          const startPos = PLAYERS_CONFIG[player].startTrackPos;
          const blockedBySelf = currentTokens.some(
            (other) => other.color === player && other.pos === startPos
          );
          if (!blockedBySelf) {
            movable.push(t.id);
          }
        }
      } else if (t.pos >= 0 && t.pos < 40) {
        // On main track
        const startPos = PLAYERS_CONFIG[player].startTrackPos;
        // Total steps walked
        const stepsWalked = (t.pos - startPos + 40) % 40;
        const newSteps = stepsWalked + dice;

        if (newSteps < 40) {
          // Stays on main track
          const targetPos = (t.pos + dice) % 40;
          const blockedBySelf = currentTokens.some(
            (other) => other.color === player && other.pos === targetPos
          );
          if (!blockedBySelf) {
            movable.push(t.id);
          }
        } else if (newSteps >= 40 && newSteps <= 43) {
          // Enters corridor (100 to 103)
          const corridorIndex = newSteps - 40; // 0..3
          const targetCorridorPos = 100 + corridorIndex;
          const blockedBySelf = currentTokens.some(
            (other) => other.color === player && other.pos === targetCorridorPos
          );
          if (!blockedBySelf) {
            movable.push(t.id);
          }
        }
      } else if (t.pos >= 100 && t.pos <= 103) {
        // Inside corridor
        const corridorIndex = t.pos - 100;
        const targetCorridorIndex = corridorIndex + dice;
        if (targetCorridorIndex <= 3) {
          const targetCorridorPos = 100 + targetCorridorIndex;
          const blockedBySelf = currentTokens.some(
            (other) => other.color === player && other.pos === targetCorridorPos
          );
          if (!blockedBySelf) {
            movable.push(t.id);
          }
        }
      }
    });

    return movable;
  };

  // Process turn after roll
  const processTurn = (dice: number) => {
    const movable = getMovableTokens(currentTurn, dice, tokens);

    if (movable.length === 0) {
      setGameLog(`تاس ${dice} آمد. حرکتی امکان‌پذیر نیست!`);
      // No move possible -> Next turn (unless rolled 6? in Mench if no move with 6, still next turn)
      setTimeout(() => {
        passTurn(false);
      }, aiSpeed);
    } else if (movable.length === 1 && currentTurn !== 'red') {
      // AI single choice
      setTimeout(() => {
        handleMoveToken(movable[0], dice);
      }, aiSpeed);
    } else if (currentTurn !== 'red') {
      // AI multi-choice: prefer capture, then emerge with 6, then advance
      setTimeout(() => {
        const bestToken = chooseBestAiToken(movable, dice, currentTurn);
        handleMoveToken(bestToken, dice);
      }, aiSpeed);
    } else {
      // Player choice
      setHighlightMovable(movable);
      setGameLog(`تاس ${dice} آمد! یک مهره درخشان را برای حرکت انتخاب کنید.`);
    }
  };

  // AI strategy heuristic
  const chooseBestAiToken = (movableIds: number[], dice: number, player: PlayerColor): number => {
    // 1. Can we capture an opponent?
    for (const id of movableIds) {
      const t = tokens.find((tk) => tk.id === id)!;
      if (t.pos >= 0 && t.pos < 40) {
        const target = (t.pos + dice) % 40;
        const opponent = tokens.find(
          (other) => other.color !== player && other.pos === target
        );
        if (opponent) return id;
      }
    }
    // 2. Can we bring a token out with 6?
    if (dice === 6) {
      const inBase = movableIds.find((id) => tokens.find((tk) => tk.id === id)!.pos === -1);
      if (inBase !== undefined) return inBase;
    }
    // 3. Move the most advanced token
    return movableIds[0];
  };

  // Move token
  const handleMoveToken = (tokenId: number, diceOverride?: number) => {
    const dice = diceOverride !== undefined ? diceOverride : diceValue;
    if (!dice || winner) return;

    const t = tokens.find((tk) => tk.id === tokenId);
    if (!t || t.color !== currentTurn) return;

    sounds.playTokenMove();
    setHighlightMovable([]);

    let nextTokens = [...tokens];
    let newPos = t.pos;
    let capturedOpponent = false;

    if (t.pos === -1 && dice === 6) {
      // Emerge
      newPos = PLAYERS_CONFIG[t.color].startTrackPos;
      setGameLog(`${PLAYERS_CONFIG[t.color].name} با عدد ۶ وارد زمین شد! 🔥`);
    } else if (t.pos >= 0 && t.pos < 40) {
      const startPos = PLAYERS_CONFIG[t.color].startTrackPos;
      const stepsWalked = (t.pos - startPos + 40) % 40;
      const newSteps = stepsWalked + dice;

      if (newSteps < 40) {
        newPos = (t.pos + dice) % 40;
      } else {
        newPos = 100 + (newSteps - 40);
      }
    } else if (t.pos >= 100 && t.pos <= 103) {
      newPos = t.pos + dice;
    }

    // Check Capture on main track (0..39)
    if (newPos >= 0 && newPos < 40) {
      const targetToken = nextTokens.find(
        (other) => other.color !== t.color && other.pos === newPos
      );
      if (targetToken) {
        capturedOpponent = true;
        sounds.playPublish();
        targetToken.pos = -1; // Send back to base!
        setGameLog(
          `💥 ${PLAYERS_CONFIG[t.color].name} مهره ${PLAYERS_CONFIG[targetToken.color].name} را زد و به پایگاه برگرداند!`
        );
      }
    }

    // Update position
    t.pos = newPos;
    setTokens([...nextTokens]);

    // Check Win
    const playerTokens = nextTokens.filter((tk) => tk.color === t.color);
    const hasWon = playerTokens.every((tk) => tk.pos >= 102); // reached end of corridor
    if (hasWon) {
      setWinner(t.color);
      sounds.playLevelUp();
      if (t.color === 'red') {
        onAddXp(100, 20);
        onShowToast('🏆 تبریک رفیق! در منچ پیروز شدی (+۱۰۰ XP و ۲۰ اعتبار)');
      } else {
        onShowToast(`🏆 ${PLAYERS_CONFIG[t.color].name} پیروز مسابقه شد!`);
      }
      return;
    }

    // If rolled 6 or captured -> Bonus Turn!
    const getsBonus = dice === 6 || capturedOpponent;
    if (getsBonus) {
      setGameLog(
        `${PLAYERS_CONFIG[t.color].name} به خاطر ${dice === 6 ? 'تاس ۶' : 'زدن مهره'} جایزه گرفت! دوباره نوبت شماست.`
      );
      setHasRolled(false);
      setDiceValue(null);
      if (currentTurn !== 'red') {
        setTimeout(handleRollDice, aiSpeed + 200);
      }
    } else {
      passTurn(true);
    }
  };

  // Pass to next player
  const passTurn = (fromMove: boolean) => {
    setHasRolled(false);
    setDiceValue(null);
    setHighlightMovable([]);

    const currentIndex = ORDER.indexOf(currentTurn);
    const nextPlayer = ORDER[(currentIndex + 1) % ORDER.length];
    setCurrentTurn(nextPlayer);

    if (PLAYERS_CONFIG[nextPlayer].isAi) {
      setGameLog(`نوبت ${PLAYERS_CONFIG[nextPlayer].name}...`);
      setTimeout(() => {
        handleRollAiTurn(nextPlayer);
      }, aiSpeed);
    } else {
      setGameLog(`نوبت شماست (${userName})! تاس بیندازید.`);
    }
  };

  // AI Turn Trigger
  const handleRollAiTurn = (player: PlayerColor) => {
    if (winner) return;
    setIsRolling(true);
    sounds.playDiceRoll();

    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setDiceValue(val);
      setIsRolling(false);
      setHasRolled(true);

      const movable = getMovableTokens(player, val, tokens);
      if (movable.length === 0) {
        setGameLog(`${PLAYERS_CONFIG[player].name} تاس ${val} آورد اما حرکتی نداشت.`);
        setTimeout(() => {
          // Pass turn from AI
          setHasRolled(false);
          setDiceValue(null);
          const currentIndex = ORDER.indexOf(player);
          const nextP = ORDER[(currentIndex + 1) % ORDER.length];
          setCurrentTurn(nextP);
          if (PLAYERS_CONFIG[nextP].isAi) {
            handleRollAiTurn(nextP);
          } else {
            setGameLog(`نوبت شماست (${userName})! تاس بیندازید.`);
          }
        }, aiSpeed);
      } else {
        const chosenId = chooseBestAiToken(movable, val, player);
        setTimeout(() => {
          handleMoveToken(chosenId, val);
        }, aiSpeed);
      }
    }, 450);
  };

  const handleResetGame = () => {
    setTokens([
      { id: 0, color: 'red', pos: -1 },
      { id: 1, color: 'red', pos: -1 },
      { id: 2, color: 'green', pos: -1 },
      { id: 3, color: 'green', pos: -1 },
      { id: 4, color: 'yellow', pos: -1 },
      { id: 5, color: 'yellow', pos: -1 },
      { id: 6, color: 'blue', pos: -1 },
      { id: 7, color: 'blue', pos: -1 },
    ]);
    setCurrentTurn('red');
    setDiceValue(null);
    setIsRolling(false);
    setHasRolled(false);
    setWinner(null);
    setHighlightMovable([]);
    setGameLog('بازی جدید آغاز شد! تاس بریزید.');
  };

  // Render 11x11 Grid Board
  const renderBoardCells = () => {
    const cells = [];

    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        // 1. Check if center trophy
        const isCenter = r === 5 && c === 5;

        // 2. Check if main track
        const trackIndex = TRACK_COORDS.findIndex((pos) => pos.r === r && pos.c === c);

        // 3. Check corridor
        let corridorColor: PlayerColor | null = null;
        let corridorStep = -1;
        for (const col of ORDER) {
          const idx = CORRIDOR_COORDS[col].findIndex((pos) => pos.r === r && pos.c === c);
          if (idx !== -1) {
            corridorColor = col;
            corridorStep = idx;
            break;
          }
        }

        // 4. Check Bases
        let baseColor: PlayerColor | null = null;
        let baseIndex = -1;
        for (const col of ORDER) {
          const idx = BASE_COORDS[col].findIndex((pos) => pos.r === r && pos.c === c);
          if (idx !== -1) {
            baseColor = col;
            baseIndex = idx;
            break;
          }
        }

        // Find tokens on this cell
        let occupyingTokens: Token[] = [];
        if (trackIndex !== -1) {
          occupyingTokens = tokens.filter((t) => t.pos === trackIndex);
        } else if (corridorColor && corridorStep !== -1) {
          occupyingTokens = tokens.filter(
            (t) => t.color === corridorColor && t.pos === 100 + corridorStep
          );
        } else if (baseColor && baseIndex !== -1) {
          // Token in base
          const baseTokensOfColor = tokens.filter((t) => t.color === baseColor && t.pos === -1);
          if (baseTokensOfColor[baseIndex]) {
            occupyingTokens = [baseTokensOfColor[baseIndex]];
          }
        }

        // Cell Styling
        let bgStyle = 'bg-slate-900/40 border-slate-800/60';
        if (isCenter) {
          bgStyle = 'bg-amber-400/20 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]';
        } else if (trackIndex !== -1) {
          // Starting cells get bright colors
          if (trackIndex === 0) bgStyle = 'bg-red-500/30 border-red-500/70';
          else if (trackIndex === 10) bgStyle = 'bg-emerald-500/30 border-emerald-500/70';
          else if (trackIndex === 20) bgStyle = 'bg-amber-500/30 border-amber-500/70';
          else if (trackIndex === 30) bgStyle = 'bg-blue-500/30 border-blue-500/70';
          else bgStyle = 'bg-slate-800/80 border-slate-700/80';
        } else if (corridorColor) {
          if (corridorColor === 'red') bgStyle = 'bg-red-500/40 border-red-500/80';
          if (corridorColor === 'green') bgStyle = 'bg-emerald-500/40 border-emerald-500/80';
          if (corridorColor === 'yellow') bgStyle = 'bg-amber-500/40 border-amber-500/80';
          if (corridorColor === 'blue') bgStyle = 'bg-blue-500/40 border-blue-500/80';
        } else if (baseColor) {
          if (baseColor === 'red') bgStyle = 'bg-red-950/60 border-red-800/60';
          if (baseColor === 'green') bgStyle = 'bg-emerald-950/60 border-emerald-800/60';
          if (baseColor === 'yellow') bgStyle = 'bg-amber-950/60 border-amber-800/60';
          if (baseColor === 'blue') bgStyle = 'bg-blue-950/60 border-blue-800/60';
        } else {
          // Empty inactive board space
          bgStyle = 'bg-transparent border-transparent';
        }

        cells.push(
          <div
            key={`${r}-${c}`}
            className={`relative flex items-center justify-center rounded-lg border text-[10px] select-none transition-all duration-200 aspect-square ${bgStyle}`}
          >
            {isCenter && <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}

            {/* Token display inside cell */}
            {occupyingTokens.map((t) => {
              const isMovable = highlightMovable.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => isMovable && handleMoveToken(t.id)}
                  disabled={!isMovable}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black shadow-lg transform transition-all duration-300 z-10 cursor-pointer ${
                    t.color === 'red'
                      ? 'bg-gradient-to-tr from-red-600 to-rose-400 text-white ring-1 ring-white/50'
                      : t.color === 'green'
                      ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white'
                      : t.color === 'yellow'
                      ? 'bg-gradient-to-tr from-amber-600 to-amber-300 text-slate-950'
                      : 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white'
                  } ${
                    isMovable
                      ? 'ring-4 ring-white animate-bounce scale-115 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                      : ''
                  }`}
                  title={`${PLAYERS_CONFIG[t.color].name}`}
                >
                  <span className="text-[10px] leading-none">
                    {t.color === 'red' ? '🔴' : t.color === 'green' ? '🟢' : t.color === 'yellow' ? '🟡' : '🔵'}
                  </span>
                </button>
              );
            })}
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#1e293b] bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>منچ ایرانی شهر توانا (Mench Arena)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] font-bold border border-[#38bdf8]/30">
                تعاملی و زنده
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            با تاس ریختن واقعی و هوش مصنوعی همسنگر؛ قانون ۶، زدن مهره و ورود به قلب پیروزی!
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handleResetGame}
            className="px-3 py-2 min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازی مجدد</span>
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Board Canvas (Left 2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#030712] p-3 sm:p-4 flex flex-col items-center justify-center shadow-inner">
          <div className="w-full max-w-[440px] aspect-square grid grid-cols-11 gap-1 p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl">
            {renderBoardCells()}
          </div>

          {/* Status Message */}
          <div className="mt-3 text-center text-xs sm:text-sm font-bold text-amber-300 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl w-full max-w-[440px]">
            {gameLog}
          </div>
        </div>

        {/* Game Dashboard & Controls (Right Column) */}
        <div className="space-y-3">
          {/* Active Turn & Dice Box */}
          <div className="rounded-2xl border border-[#38bdf8]/30 bg-slate-950 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">نوبت فعلی:</span>
              <span
                className={`font-black px-2 py-0.5 rounded-full border ${PLAYERS_CONFIG[currentTurn].bgHex} ${PLAYERS_CONFIG[currentTurn].borderHex} text-white`}
              >
                {PLAYERS_CONFIG[currentTurn].avatar} {PLAYERS_CONFIG[currentTurn].name}
              </span>
            </div>

            {/* Big Interactive Dice */}
            <div className="flex flex-col items-center justify-center py-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <button
                onClick={handleRollDice}
                disabled={isRolling || hasRolled || currentTurn !== 'red' || !!winner}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl transition-all duration-300 cursor-pointer select-none ${
                  currentTurn === 'red' && !hasRolled && !winner
                    ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 text-slate-950 ring-4 ring-amber-400/50 hover:scale-105 active:scale-95 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                } ${isRolling ? 'rotate-180 scale-95' : ''}`}
                title="برای انداختن تاس کلیک کنید"
              >
                {diceValue !== null ? (
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-4xl font-mono">{diceValue}</span>
                    <span className="text-[10px] font-bold mt-1 opacity-80">
                      {diceValue === 6 ? '✨ جایزه!' : ''}
                    </span>
                  </span>
                ) : (
                  <span>🎲</span>
                )}
              </button>

              {currentTurn === 'red' && !hasRolled && !winner && (
                <button
                  onClick={handleRollDice}
                  disabled={isRolling}
                  className="mt-3 px-4 py-2 min-h-[42px] rounded-xl bg-[#38bdf8] text-slate-950 font-black text-xs hover:opacity-90 shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>تاس بریزید!</span>
                </button>
              )}
            </div>

            {/* Instruction note */}
            <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <p className="flex items-center gap-1 text-amber-300 font-bold">
                <span>💡</span>
                <span>قوانین سریع منچ:</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>با آوردن عدد ۶، مهره از پایگاه خارج می‌شود و یک نوبت اضافه می‌گیرید.</li>
                <li>اگر روی مهره حریف بروید، آن را می‌زنید و به خانه‌اش برمی‌گردد!</li>
                <li>مهره‌های درخشان آماده کلیک و حرکت هستند.</li>
              </ul>
            </div>
          </div>

          {/* Players Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-300">وضعیت شرکت‌کنندگان:</h4>
            <div className="space-y-1.5 text-xs">
              {ORDER.map((colorKey) => {
                const p = PLAYERS_CONFIG[colorKey];
                const pTokens = tokens.filter((t) => t.color === colorKey);
                const inBase = pTokens.filter((t) => t.pos === -1).length;
                const inCorridor = pTokens.filter((t) => t.pos >= 100).length;
                const isCurrent = currentTurn === colorKey;

                return (
                  <div
                    key={colorKey}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isCurrent
                        ? `${p.bgHex} ${p.borderHex} text-white font-bold`
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.avatar}</span>
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[10px] flex items-center gap-2">
                      <span>پایگاه: {inBase}</span>
                      <span className="text-amber-400 font-bold">پیروزی: {inCorridor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Victory Card */}
          {winner && (
            <div className="rounded-2xl border border-amber-400/50 bg-gradient-to-tr from-amber-500/20 via-slate-950 to-rose-500/20 p-4 text-center space-y-2 animate-bounce">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-black text-white">
                🎉 {PLAYERS_CONFIG[winner].name} برنده شد!
              </h3>
              <p className="text-xs text-slate-300">
                {winner === 'red'
                  ? 'شما قهرمان زمین منچ شدید و پاداش شایستگی به شما اهدا شد.'
                  : 'یک دور دیگر امتحان کنید و حریفان را به چالش بکشید.'}
              </p>
              <button
                onClick={handleResetGame}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 cursor-pointer"
              >
                شروع دور جدید
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
