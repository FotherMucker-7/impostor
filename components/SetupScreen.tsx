import React, { useState, useEffect } from 'react';
import { Users, UserX, BrainCircuit, Shuffle, Loader2, Edit3 } from 'lucide-react';
import { Button } from './Button';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';
import { CategoryType } from '../types';

interface SetupScreenProps {
  onStartGame: (playerNames: string[], imposterCount: number, type: CategoryType) => void;
  isLoading: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, isLoading }) => {
  const [playerCount, setPlayerCount] = useState(5);
  const [imposterCount, setImposterCount] = useState(1);
  const [gameType, setGameType] = useState<CategoryType>('CLASSIC');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [showNameEdit, setShowNameEdit] = useState(false);

  // Initialize or update names when count changes
  useEffect(() => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (newNames.length < playerCount) {
        for (let i = newNames.length; i < playerCount; i++) {
          newNames.push(`Jugador ${i + 1}`);
        }
      } else if (newNames.length > playerCount) {
        newNames.length = playerCount;
      }
      return newNames;
    });
  }, [playerCount]);

  const handlePlayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setPlayerCount(val);
    
    // Auto-adjust imposters logic
    if (val < 7) setImposterCount(1);
    else if (val >= 7 && val < 10) setImposterCount(Math.min(imposterCount, 2)); 
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const incrementImposter = () => {
    if (imposterCount < playerCount - 2) setImposterCount(p => p + 1);
  };

  const decrementImposter = () => {
    if (imposterCount > 1) setImposterCount(p => p - 1);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto custom-scrollbar">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
          El Impostor
        </h1>
        <p className="text-slate-400 text-lg">Descubre quién miente.</p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Players Control */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-300">
              <Users size={24} />
              <span className="font-bold text-lg">Jugadores</span>
            </div>
            <span className="text-3xl font-bold text-white">{playerCount}</span>
          </div>
          <input
            type="range"
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            value={playerCount}
            onChange={handlePlayerChange}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2 mb-4">
            <span>{MIN_PLAYERS}</span>
            <span>{MAX_PLAYERS}</span>
          </div>

          <button 
            onClick={() => setShowNameEdit(!showNameEdit)}
            className="w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 rounded-lg hover:bg-slate-700"
          >
            <Edit3 size={14} />
            {showNameEdit ? "Ocultar Nombres" : "Editar Nombres"}
          </button>

          {showNameEdit && (
            <div className="grid grid-cols-2 gap-2 mt-4 animate-in fade-in zoom-in-95 duration-200">
              {playerNames.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={`Jugador ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Imposters Control */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <UserX size={24} />
              <span className="font-bold text-lg">Impostores</span>
            </div>
            <span className="text-3xl font-bold text-white">{imposterCount}</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              onClick={decrementImposter} 
              disabled={imposterCount <= 1}
              className="flex-1"
            >
              -
            </Button>
            <Button 
              variant="secondary" 
              onClick={incrementImposter} 
              disabled={imposterCount >= playerCount - 2}
              className="flex-1"
            >
              +
            </Button>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setGameType('CLASSIC')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              gameType === 'CLASSIC'
                ? 'border-indigo-500 bg-indigo-500/20 text-white'
                : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Shuffle size={32} />
            <span className="font-bold">Clásico</span>
            <span className="text-xs opacity-70">Palabras predefinidas</span>
          </button>

          <button
            onClick={() => setGameType('AI')}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              gameType === 'AI'
                ? 'border-cyan-500 bg-cyan-500/20 text-white'
                : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BrainCircuit size={32} />
            <span className="font-bold">IA Generativa</span>
            <span className="text-xs opacity-70">Infinitas posibilidades</span>
          </button>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <Button 
          fullWidth 
          onClick={() => onStartGame(playerNames, imposterCount, gameType)}
          disabled={isLoading}
          className="text-lg py-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Generando...
            </>
          ) : (
            "Comenzar Partida"
          )}
        </Button>
      </div>
    </div>
  );
};
