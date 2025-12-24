import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import type { RoleType, TeamType } from '@/types/game';
import { useGameSession } from '@/hooks/useGameSession';
import RoleSelector from '@/components/RoleSelector';
import PlayerOnboarding from '@/components/player/PlayerOnboarding';
import PlayerGame from '@/components/player/PlayerGame';
import PresenterLobby from '@/components/presenter/PresenterLobby';
import PresenterGame from '@/components/presenter/PresenterGame';
import PresenterResults from '@/components/presenter/PresenterResults';
import ControllerView from '@/components/controller/ControllerView';

const Index = () => {
  const [role, setRole] = useState<RoleType | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  const {
    session,
    players,
    teamScores,
    loading,
    currentPlayerId,
    setCurrentPlayerId,
    joinGame,
    submitAnswer,
    startGame,
    nextQuestion,
    resetGame,
  } = useGameSession();

  // Check for Supabase configuration
  const hasSupabaseConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  // Check for existing player session
  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedPlayerId) {
      const existingPlayer = players.find((p) => p.id === storedPlayerId);
      if (existingPlayer) {
        setCurrentPlayerId(storedPlayerId);
        setRole('player');
        setHasJoined(true);
      } else {
        localStorage.removeItem('playerId');
      }
    }
  }, [players, setCurrentPlayerId]);

  // Show error if Supabase is not configured
  if (!hasSupabaseConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Configuration Required</h1>
          <p className="text-white/80 mb-4">
            This application requires Supabase environment variables to function.
          </p>
          <div className="text-left bg-black/20 p-4 rounded text-sm text-white/90 font-mono">
            <p className="mb-2">Please set the following environment variables:</p>
            <p className="mb-1">• VITE_SUPABASE_URL</p>
            <p>• VITE_SUPABASE_PUBLISHABLE_KEY</p>
          </div>
          <p className="text-white/60 text-sm mt-4">
            For GitHub Pages, add these as repository secrets and update the workflow.
          </p>
        </div>
      </div>
    );
  }

  const handleJoinGame = async (alias: string, team: TeamType) => {
    const playerId = await joinGame(alias, team);
    if (playerId) {
      setHasJoined(true);
    }
  };

  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-royal">
        <div className="text-center animate-fade-in">
          <div className="text-5xl mb-4 animate-float">👑</div>
          <p className="text-primary font-medium">Preparing the Royal Arena...</p>
        </div>
      </div>
    );
  }

  // Role Selection
  if (!role) {
    return (
      <>
        <Helmet>
          <title>Puzzle-e-Sultan - The Royal Quiz Arena</title>
          <meta
            name="description"
            content="Enter the royal arena and compete in Puzzle-e-Sultan, an exciting multiplayer quiz game with teams and real-time competition."
          />
        </Helmet>
        <RoleSelector onSelectRole={setRole} />
      </>
    );
  }

  // Player View
  if (role === 'player') {
    if (!hasJoined || !currentPlayer) {
      return (
        <>
          <Helmet>
            <title>Join the Battle - Puzzle-e-Sultan</title>
          </Helmet>
          <PlayerOnboarding onJoin={handleJoinGame} />
        </>
      );
    }

    return (
      <>
        <Helmet>
          <title>{currentPlayer.alias} - Puzzle-e-Sultan</title>
        </Helmet>
        <PlayerGame
          session={session!}
          player={currentPlayer}
          teamScores={teamScores}
          onSubmitAnswer={(index) => submitAnswer(currentPlayer.id, index)}
        />
      </>
    );
  }

  // Presenter View
  if (role === 'presenter') {
    if (!session) return null;

    return (
      <>
        <Helmet>
          <title>Puzzle-e-Sultan - Grand Stage</title>
        </Helmet>
        {session.state === 'lobby' && (
          <PresenterLobby players={players} teamScores={teamScores} />
        )}
        {session.state === 'playing' && (
          <PresenterGame session={session} players={players} teamScores={teamScores} />
        )}
        {session.state === 'results' && (
          <PresenterResults players={players} teamScores={teamScores} />
        )}
      </>
    );
  }

  // Controller View
  if (role === 'controller') {
    return (
      <>
        <Helmet>
          <title>Vizier's Chamber - Puzzle-e-Sultan</title>
        </Helmet>
        <ControllerView
          session={session}
          players={players}
          teamScores={teamScores}
          onStartGame={startGame}
          onNextQuestion={nextQuestion}
          onResetGame={resetGame}
        />
      </>
    );
  }

  return null;
};

export default Index;
