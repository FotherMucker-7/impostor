import React, { useState } from 'react';
import { Eye, EyeOff, User, Fingerprint } from 'lucide-react';
import { Button } from './Button';
import { Player, PlayerRole } from '../types';

interface RevealScreenProps {
  player: Player;
  nextPlayerName?: string;
  category: string;
  secretWord: string;
  playerIndex: number;
  totalPlayers: number;
  onNext: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  player,
  nextPlayerName,
  category,
  secretWord,
  playerIndex,
  totalPlayers,
  onNext,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isImposter = player.role === PlayerRole.IMPOSTOR;

  const handleReveal = () => {
    setIsFlipped(true);
  };

  const handleHide = () => {
    setIsFlipped(false);
    // Add small delay to allow flip back animation before changing state in parent
    setTimeout(() => {
        onNext();
    }, 300);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6">
      
      {/* Progress */}
      <div className="text-center mb-6">
          <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Revelación {playerIndex + 1} / {totalPlayers}
          </span>
      </div>

      {/* Card Container */}
      <div className="flex-1 relative perspective-1000 w-full mb-8">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          
          {/* FRONT OF CARD (Locked) */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-slate-800 rounded-3xl border-4 border-slate-700 flex flex-col items-center justify-center p-6 shadow-2xl">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <User size={48} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 text-center">{player.name}</h2>
              <p className="text-slate-400 text-center max-w-[250px]">
                Toma el dispositivo. Asegúrate de que nadie más mire la pantalla.
              </p>
              <div className="mt-12 w-full">
                <Button onClick={handleReveal} fullWidth className="py-6 text-xl shadow-indigo-500/50">
                  <div className="flex items-center justify-center gap-3">
                    <Fingerprint size={24} />
                    Tocar para Revelar
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* BACK OF CARD (Role Revealed) */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
             <div className="w-full h-full bg-slate-800 rounded-3xl border-4 border-slate-700 p-1 relative overflow-hidden shadow-2xl flex flex-col">
                {/* Decoration */}
                <div className={`absolute top-0 left-0 w-full h-4 ${isImposter ? 'bg-gradient-to-r from-red-500 to-orange-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}></div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                    <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mt-4">Tu Identidad</h3>
                    
                    {isImposter ? (
                        <div className="space-y-6 animate-in zoom-in duration-300">
                            <h2 className="text-5xl font-black text-red-500 uppercase tracking-tighter drop-shadow-lg">¡Impostor!</h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                No sabes la palabra.<br/>
                                <span className="text-sm opacity-75">Finge saber de qué hablan.</span>
                            </p>
                            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-600">
                                <p className="text-xs text-slate-500 uppercase mb-1">Pista de Categoría</p>
                                <p className="text-2xl font-bold text-white">{category}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in zoom-in duration-300">
                            <h2 className="text-5xl font-black text-emerald-400 uppercase tracking-tighter drop-shadow-lg">Civil</h2>
                            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-600 shadow-inner">
                                <p className="text-xs text-slate-500 uppercase mb-2">Palabra Secreta</p>
                                <p className="text-4xl font-black text-white">{secretWord}</p>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Categoría: <span className="text-slate-200">{category}</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                    <Button onClick={handleHide} fullWidth variant="secondary" className="py-4">
                        <div className="flex items-center justify-center gap-3">
                            <EyeOff size={20} />
                            {nextPlayerName ? (
                                <span>Pasar a <span className="text-white font-bold">{nextPlayerName}</span></span>
                            ) : (
                                <span>Comenzar Juego</span>
                            )}
                        </div>
                    </Button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
