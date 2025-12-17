import React from 'react';
import { Gavel, Fingerprint } from 'lucide-react';
import { Button } from './Button';
import { Player } from '../types';

interface VotingScreenProps {
  players: Player[];
  onVote: (playerId: number) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ players, onVote }) => {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full p-6 animate-in fade-in duration-500">
      <div className="text-center mb-6">
        <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
            <Gavel size={48} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Votación</h2>
        <p className="text-slate-400">
          El grupo debe decidir.<br/>¿Quién es el impostor?
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar pr-2">
        <div className="grid grid-cols-1 gap-3">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => onVote(player.id)}
              className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-indigo-500 transition-all active:scale-[0.98]"
            >
              <span className="font-bold text-lg text-slate-200 group-hover:text-white">{player.name}</span>
              <Fingerprint className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-center text-slate-600 mb-4">
          Toca el nombre del jugador que ha sido votado por la mayoría.
      </p>
    </div>
  );
};
