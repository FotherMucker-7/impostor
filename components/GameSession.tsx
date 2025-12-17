import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Flag, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { Player } from '../types';

interface GameSessionProps {
  category: string;
  players: Player[];
  startingPlayerIndex: number;
  onVotePhase: () => void;
}

export const GameSession: React.FC<GameSessionProps> = ({ category, players, startingPlayerIndex, onVotePhase }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startingPlayer = players[startingPlayerIndex];

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full p-6">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-lg mb-8">
        <div>
          <p className="text-xs text-slate-400 uppercase font-bold">Categoría</p>
          <p className="text-xl font-bold text-white truncate max-w-[150px]">{category}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg">
          <Clock size={16} className="text-indigo-400" />
          <span className="font-mono text-xl text-indigo-400">{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        
        {/* Starter Indicator */}
        <div className="bg-gradient-to-b from-indigo-900/50 to-slate-900/50 p-6 rounded-2xl border border-indigo-500/30 w-full animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-4">
                 <div className="bg-indigo-500 p-3 rounded-full shadow-lg shadow-indigo-500/40">
                    <MessageCircle size={32} className="text-white" />
                 </div>
            </div>
            <h3 className="text-slate-400 text-sm uppercase font-bold mb-1">Comienza preguntando</h3>
            <p className="text-3xl font-black text-white">{startingPlayer.name}</p>
        </div>
        
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Fase de Discusión</h2>
            <p className="text-slate-400 max-w-xs mx-auto">
            Hagan preguntas por turnos para encontrar al impostor sin revelar la palabra secreta.
            </p>
        </div>

      </div>

      <div className="mt-8">
        <Button onClick={onVotePhase} fullWidth variant="danger" className="py-4 shadow-red-900/20">
          <div className="flex items-center justify-center gap-2">
            <Flag size={20} />
            Terminar y Votar
          </div>
        </Button>
      </div>
    </div>
  );
};
