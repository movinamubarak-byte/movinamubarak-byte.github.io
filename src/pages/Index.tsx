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
