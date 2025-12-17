import React, { useState } from 'react';
import { User, CheckCircle2, RotateCcw, Skull, Trophy } from 'lucide-react';
import { Button } from './Button';
import { Player, PlayerRole } from '../types';

interface ResultScreenProps {
  players: Player[];
  secretWord: string;
  category: string;
  votedPlayerId: number | null;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ players, secretWord, category, votedPlayerId, onRestart }) => {
  const [revealed, setRevealed] = useState(false);

  const votedPlayer = players.find(p => p.id === votedPlayerId);
  const imposters = players.filter(p => p.role === PlayerRole.IMPOSTOR);
  
  // Logic: Civilians win if they voted for an imposter.
  const civiliansWin = votedPlayer?.role === PlayerRole.IMPOSTOR;
  const imposterWin = !civiliansWin;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full p-6 animate-in fade-in duration-500">
      
      {/* Result Header */}
      <div className="text-center mb-6">
        {revealed ? (
            civiliansWin ? (
                <div className="animate-in zoom-in duration-500">
                    <h2 className="text-4xl font-black text-emerald-400 mb-1">¡Civiles Ganan!</h2>
                    <p className="text-slate-300">Descubrieron al impostor.</p>
                </div>
            ) : (
                <div className="animate-in zoom-in duration-500">
                    <h2 className="text-4xl font-black text-red-500 mb-1">¡Impostor Gana!</h2>
                    <p className="text-slate-300">Expulsaron a un inocente.</p>
                </div>
            )
        ) : (
            <div>
                 <h2 className="text-3xl font-black text-white mb-2">Resultados</h2>
                 <p className="text-slate-400">¿Acertaron?</p>
            </div>
        )}
      </div>

      {/* Secret Word Card */}
      <div className="mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
          <p className="text-xs text-slate-500 uppercase mb-1">Palabra Secreta</p>
          <span className="text-2xl font-bold text-indigo-400">{secretWord}</span>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{category}</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
        <div className="space-y-3">
          {players.map((player) => {
            const isImposter = player.role === PlayerRole.IMPOSTOR;
            const isVoted = player.id === votedPlayerId;
            
            return (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                  revealed && isImposter 
                    ? 'bg-red-500/10 border-red-500/50' 
                    : isVoted 
                        ? 'bg-slate-700 border-slate-500' 
                        : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`relative p-2 rounded-full ${revealed && isImposter ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {isVoted && <Skull size={12} className="absolute -top-1 -right-1 text-red-500 bg-slate-900 rounded-full" />}
                    <User size={18} />
                  </div>
                  <div>
                    <span className={`font-bold block ${isVoted ? 'text-white' : 'text-slate-300'}`}>
                        {player.name}
                    </span>
                    {isVoted && <span className="text-[10px] text-red-400 uppercase font-bold">Expulsado</span>}
                  </div>
                </div>
                
                {revealed && (
                    <div className="text-right">
                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${isImposter ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {isImposter ? 'IMPOSTOR' : 'CIVIL'}
                        </span>
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        {!revealed ? (
           <Button onClick={() => setRevealed(true)} fullWidth variant="primary" className="py-4">
             <div className="flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Revelar Identidades
             </div>
           </Button>
        ) : (
           <Button onClick={onRestart} fullWidth variant="primary" className="py-4">
             <div className="flex items-center justify-center gap-2">
                <RotateCcw size={20} />
                Jugar de Nuevo
             </div>
           </Button>
        )}
      </div>
    </div>
  );
};
