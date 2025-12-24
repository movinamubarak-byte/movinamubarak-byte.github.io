import { useState, useEffect } from 'react';
import { questions, getRoundName, QUESTION_TIME, TOTAL_QUESTIONS } from '@/data/questions';
import type { GameSession, Player, TeamScore, TeamType } from '@/types/game';
import { TEAM_CONFIG } from '@/types/game';

interface PresenterGameProps {
  session: GameSession;
  players: Player[];
  teamScores: TeamScore[];
}

const PresenterGame = ({ session, players, teamScores }: PresenterGameProps) => {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const currentQuestion = questions[session.current_question_index];
  const roundName = getRoundName(session.current_question_index);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
  }, [session.current_question_index]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.current_question_index]);

  const answeredCount = players.filter((p) => p.has_answered).length;
  const isUrgent = timeLeft <= 5;

  // Sort teams by score
  const sortedTeams = [...teamScores].sort((a, b) => b.total_score - a.total_score);
  const teams: TeamType[] = ['ruby', 'sapphire', 'amber', 'emerald'];

  return (
    <div className="min-h-screen flex flex-col p-8 pattern-royal">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        {/* Round Info */}
        <div className="animate-fade-in">
          <p className="text-primary font-medium text-lg">{roundName}</p>
          <p className="text-muted-foreground text-sm">
            Question {session.current_question_index + 1} of {TOTAL_QUESTIONS}
          </p>
        </div>

        {/* Timer */}
        <div
          className={`text-center px-8 py-4 rounded-2xl border-2 ${
            isUrgent
              ? 'border-destructive bg-destructive/20 animate-countdown-urgent'
              : 'border-primary/30 bg-card/30'
          }`}
        >
          <div
            className={`font-display text-6xl font-bold ${
              isUrgent ? 'text-destructive' : 'text-primary'
            }`}
          >
            {timeLeft}
          </div>
          <p className={`text-sm ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
            seconds
          </p>
        </div>

        {/* Answered Count */}
        <div className="text-right animate-fade-in">
          <p className="text-muted-foreground text-sm">Warriors Answered</p>
          <p className="font-display text-3xl font-bold text-primary">
            {answeredCount}/{players.length}
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card/50 rounded-3xl border-2 border-primary/20 p-8 mb-8 animate-scale-in shadow-gold">
        <p className="text-primary text-lg mb-2">{currentQuestion.category}</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            className="bg-card/30 rounded-xl border border-primary/20 p-6 flex items-center gap-4 animate-slide-in-right"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-foreground text-xl font-medium">{option}</span>
          </div>
        ))}
      </div>

      {/* Team Scoreboard */}
      <div className="grid grid-cols-4 gap-4 mt-auto">
        {teams.map((team, index) => {
          const config = TEAM_CONFIG[team];
          const score = teamScores.find((s) => s.team === team)?.total_score || 0;
          const rank = sortedTeams.findIndex((s) => s.team === team) + 1;
          const teamPlayerCount = players.filter((p) => p.team === team).length;

          return (
            <div
              key={team}
              className={`bg-card/30 rounded-xl border-2 p-4 text-center transition-all ${
                rank === 1 ? `${config.borderClass} shadow-lg` : 'border-border'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">{config.emoji}</span>
                {rank === 1 && <span className="text-2xl">👑</span>}
              </div>
              <p className="font-display text-lg font-bold text-foreground truncate">
                {config.name.split(' ')[0]}
              </p>
              <p className="font-display text-3xl font-bold text-primary">{score}</p>
              <p className="text-xs text-muted-foreground">{teamPlayerCount} warriors</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresenterGame;
