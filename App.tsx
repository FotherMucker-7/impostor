import React, { useState } from 'react';
import { GamePhase, GameState, Player, PlayerRole, CategoryType } from './types';
import { SetupScreen } from './components/SetupScreen';
import { RevealScreen } from './components/RevealScreen';
import { GameSession } from './components/GameSession';
import { VotingScreen } from './components/VotingScreen';
import { ResultScreen } from './components/ResultScreen';
import { LOCAL_WORDS } from './constants';
import { generateWordWithAI } from './services/geminiService';

const INITIAL_STATE: GameState = {
  phase: GamePhase.SETUP,
  players: [],
  category: '',
  secretWord: '',
  currentPlayerRevealIndex: 0,
  startingPlayerIndex: 0,
  timeElapsed: 0,
  winner: null,
  votedPlayerId: null
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async (playerNames: string[], imposterCount: number, type: CategoryType) => {
    setIsLoading(true);
    let wordConfig;

    try {
      if (type === 'AI') {
        wordConfig = await generateWordWithAI();
      } else {
        const randomIndex = Math.floor(Math.random() * LOCAL_WORDS.length);
        wordConfig = LOCAL_WORDS[randomIndex];
      }
    } catch (e) {
      console.error("Failed to generate word", e);
      wordConfig = LOCAL_WORDS[0]; // Fallback
    }

    // Create Players with custom names
    const newPlayers: Player[] = playerNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || `Jugador ${i + 1}`,
      role: PlayerRole.CIVILIAN,
      isRevealed: false
    }));

    // Assign Imposters randomly
    let assignedImposters = 0;
    while (assignedImposters < imposterCount) {
      const randomIndex = Math.floor(Math.random() * newPlayers.length);
      if (newPlayers[randomIndex].role === PlayerRole.CIVILIAN) {
        newPlayers[randomIndex].role = PlayerRole.IMPOSTOR;
        assignedImposters++;
      }
    }

    // Pick random starter
    const randomStarterIndex = Math.floor(Math.random() * newPlayers.length);

    setGameState({
      ...INITIAL_STATE,
      phase: GamePhase.REVEAL,
      players: newPlayers,
      category: wordConfig.category,
      secretWord: wordConfig.word,
      startingPlayerIndex: randomStarterIndex
    });
    setIsLoading(false);
  };

  const handleNextReveal = () => {
    const nextIndex = gameState.currentPlayerRevealIndex + 1;
    if (nextIndex >= gameState.players.length) {
      setGameState(prev => ({ ...prev, phase: GamePhase.PLAY }));
    } else {
      setGameState(prev => ({ ...prev, currentPlayerRevealIndex: nextIndex }));
    }
  };

  const handleVotePhase = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.VOTE }));
  };

  const handleVote = (votedId: number) => {
    setGameState(prev => ({ 
        ...prev, 
        phase: GamePhase.RESULT,
        votedPlayerId: votedId
    }));
  };

  const restartGame = () => {
    setGameState(INITIAL_STATE);
  };

  // Helper to get next player name for the "Pass to..." feature
  const getNextPlayerName = () => {
      const nextIndex = gameState.currentPlayerRevealIndex + 1;
      if (nextIndex < gameState.players.length) {
          return gameState.players[nextIndex].name;
      }
      return undefined;
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30">
      <main className="h-screen w-full overflow-hidden">
        {gameState.phase === GamePhase.SETUP && (
          <SetupScreen onStartGame={startGame} isLoading={isLoading} />
        )}

        {gameState.phase === GamePhase.REVEAL && (
          <RevealScreen
            player={gameState.players[gameState.currentPlayerRevealIndex]}
            nextPlayerName={getNextPlayerName()}
            playerIndex={gameState.currentPlayerRevealIndex}
            totalPlayers={gameState.players.length}
            category={gameState.category}
            secretWord={gameState.secretWord}
            onNext={handleNextReveal}
          />
        )}

        {gameState.phase === GamePhase.PLAY && (
          <GameSession
            category={gameState.category}
            players={gameState.players}
            startingPlayerIndex={gameState.startingPlayerIndex}
            onVotePhase={handleVotePhase}
          />
        )}

        {gameState.phase === GamePhase.VOTE && (
          <VotingScreen
            players={gameState.players}
            onVote={handleVote}
          />
        )}

        {gameState.phase === GamePhase.RESULT && (
          <ResultScreen
            players={gameState.players}
            secretWord={gameState.secretWord}
            category={gameState.category}
            votedPlayerId={gameState.votedPlayerId}
            onRestart={restartGame}
          />
        )}
      </main>
    </div>
  );
}
