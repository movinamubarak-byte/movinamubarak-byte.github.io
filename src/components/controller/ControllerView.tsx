import { useState } from 'react';
import { Lock, Play, SkipForward, RotateCcw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { questions, getRoundName, TOTAL_QUESTIONS } from '@/data/questions';
import type { GameSession, Player, TeamScore, TeamType } from '@/types/game';
import { TEAM_CONFIG } from '@/types/game';

interface ControllerViewProps {
  session: GameSession | null;
  players: Player[];
  teamScores: TeamScore[];
  onStartGame: () => Promise<void>;
  onNextQuestion: () => Promise<void>;
  onResetGame: () => Promise<void>;
}

const ADMIN_PIN = '1234';

const ControllerView = ({
  session,
  players,
  teamScores,
  onStartGame,
  onNextQuestion,
  onResetGame,
}: ControllerViewProps) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePinSubmit = () => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const handleAction = async (action: 'start' | 'next' | 'reset') => {
    setIsLoading(action);
    try {
      if (action === 'start') await onStartGame();
      else if (action === 'next') await onNextQuestion();
      else if (action === 'reset') await onResetGame();
    } finally {
      setIsLoading(null);
    }
  };

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pattern-royal">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Vizier's Chamber
            </h1>
            <p className="text-muted-foreground">Enter the sacred PIN to proceed</p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              className={`text-center text-2xl tracking-widest h-14 ${
                pinError ? 'border-destructive animate-shake' : ''
              }`}
              maxLength={4}
            />
            {pinError && (
              <p className="text-destructive text-sm text-center">
                Incorrect PIN. Try again.
              </p>
            )}
            <Button
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600"
            >
              <Lock className="w-4 h-4 mr-2" />
              Enter Chamber
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session ? questions[session.current_question_index] : null;
  const roundName = session ? getRoundName(session.current_question_index) : '';
  const answeredCount = players.filter((p) => p.has_answered).length;
  const teams: TeamType[] = ['ruby', 'sapphire', 'amber', 'emerald'];

  return (
    <div className="min-h-screen p-4 md:p-6 pattern-royal">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Vizier's Control Room
          </h1>
          <p className="text-muted-foreground text-sm">Command the arena</p>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            session?.state === 'lobby'
              ? 'bg-blue-500/20 text-blue-400'
              : session?.state === 'playing'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-primary/20 text-primary'
          }`}
        >
          {session?.state === 'lobby'
            ? '⏳ Lobby'
            : session?.state === 'playing'
            ? '🎮 Playing'
            : '🏆 Results'}
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid gap-4 mb-6">
        {session?.state === 'lobby' && (
          <Button
            onClick={() => handleAction('start')}
            disabled={players.length === 0 || isLoading === 'start'}
            className="h-16 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            <Play className="w-6 h-6 mr-3" />
            {isLoading === 'start' ? 'Awakening...' : 'Awaken the Sultan'}
          </Button>
        )}

        {session?.state === 'playing' && (
          <Button
            onClick={() => handleAction('next')}
            disabled={isLoading === 'next'}
            className="h-16 text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <SkipForward className="w-6 h-6 mr-3" />
            {isLoading === 'next' ? 'Loading...' : 'Next Puzzle'}
          </Button>
        )}

        <Button
          onClick={() => handleAction('reset')}
          disabled={isLoading === 'reset'}
          variant="outline"
          className="h-12 border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isLoading === 'reset' ? 'Resetting...' : 'Reset Court'}
        </Button>
      </div>

      {/* Current Question Info */}
      {session?.state === 'playing' && currentQuestion && (
        <div className="bg-card/50 rounded-xl border border-primary/20 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary text-sm">{roundName}</span>
            <span className="text-muted-foreground text-sm">
              Q{session.current_question_index + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <p className="font-medium text-foreground mb-3">{currentQuestion.question}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Correct: {currentQuestion.options[currentQuestion.correctAnswer]}
            </span>
            <span className="text-primary font-medium">
              {answeredCount}/{players.length} answered
            </span>
          </div>
        </div>
      )}

      {/* Warriors Count */}
      <div className="bg-card/30 rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Warriors in Arena</h3>
          <span className="ml-auto bg-primary/20 px-2 py-1 rounded-full text-primary text-sm font-bold">
            {players.length}
          </span>
        </div>
      </div>

      {/* Team Scores */}
      <div className="space-y-2">
        <h3 className="font-display font-bold text-foreground mb-3">Team Standings</h3>
        {teams.map((team) => {
          const config = TEAM_CONFIG[team];
          const score = teamScores.find((s) => s.team === team)?.total_score || 0;
          const teamPlayerCount = players.filter((p) => p.team === team).length;

          return (
            <div
              key={team}
              className="flex items-center gap-3 bg-card/30 rounded-lg p-3 border border-border"
            >
              <span className="text-2xl">{config.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{config.name}</p>
                <p className="text-xs text-muted-foreground">{teamPlayerCount} warriors</p>
              </div>
              <span className="font-display text-2xl font-bold text-primary">{score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControllerView;
