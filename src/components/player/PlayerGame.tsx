import { useState, useEffect } from 'react';
import { questions, getRoundName, QUESTION_TIME } from '@/data/questions';
import type { GameSession, Player, TeamScore } from '@/types/game';
import { TEAM_CONFIG, HINGLISH_FEEDBACK } from '@/types/game';

interface PlayerGameProps {
  session: GameSession;
  player: Player;
  teamScores: TeamScore[];
  onSubmitAnswer: (answerIndex: number) => Promise<boolean | undefined>;
}

const PlayerGame = ({ session, player, teamScores, onSubmitAnswer }: PlayerGameProps) => {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[session.current_question_index];
  const teamConfig = TEAM_CONFIG[player.team];
  const teamScore = teamScores.find((s) => s.team === player.team);

  // Reset state when question changes
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    setFeedback(null);
  }, [session.current_question_index]);

  // Timer countdown
  useEffect(() => {
    if (player.has_answered || session.state !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [player.has_answered, session.state, session.current_question_index]);

  const handleAnswer = async (index: number) => {
    if (player.has_answered || isSubmitting) return;

    setIsSubmitting(true);
    const isCorrect = await onSubmitAnswer(index);

    const feedbackMessages = isCorrect ? HINGLISH_FEEDBACK.correct : HINGLISH_FEEDBACK.incorrect;
    const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];

    setFeedback({ message: randomFeedback, isCorrect: !!isCorrect });
    setIsSubmitting(false);
  };

  // Waiting screen
  if (session.state === 'lobby') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pattern-royal">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-float">{teamConfig.emoji}</div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {player.alias}
          </h2>
          <p className="text-muted-foreground mb-4">{teamConfig.name}</p>
          <div className="animate-pulse text-primary text-lg">
            ⏳ Waiting for Sultan to begin...
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (session.state === 'results') {
    const sortedTeams = [...teamScores].sort((a, b) => b.total_score - a.total_score);
    const winningTeam = sortedTeams[0];
    const isWinner = player.team === winningTeam?.team;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pattern-royal">
        <div className="text-center animate-fade-in">
          {isWinner ? (
            <>
              <div className="text-7xl mb-4 animate-trophy-bounce">🏆</div>
              <h2 className="font-display text-4xl font-bold text-gradient-gold mb-2">
                Victory!
              </h2>
              <p className="text-primary text-xl mb-4">
                Your team conquered the arena!
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                Battle Complete
              </h2>
              <p className="text-muted-foreground text-lg mb-4">
                Well fought, warrior!
              </p>
            </>
          )}
          <div className="bg-card/50 rounded-xl p-4 border border-primary/20">
            <p className="text-muted-foreground text-sm">Your Score</p>
            <p className="font-display text-4xl font-bold text-primary">{player.score}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 pattern-royal">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{teamConfig.emoji}</span>
          <span className="font-bold text-foreground">{player.alias}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Your Score</p>
          <p className="font-display text-xl font-bold text-primary">{player.score}</p>
        </div>
      </div>

      {/* Timer */}
      <div
        className={`text-center mb-4 ${
          timeLeft <= 5 ? 'animate-countdown-urgent text-destructive' : 'text-primary'
        }`}
      >
        <div className="font-display text-5xl font-bold">{timeLeft}</div>
        <p className="text-xs text-muted-foreground">seconds left</p>
      </div>

      {/* Question */}
      <div className="bg-card/50 rounded-xl p-4 mb-6 border border-primary/20">
        <p className="text-xs text-primary mb-1">{currentQuestion.category}</p>
        <p className="font-medium text-lg text-foreground leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-xl text-center animate-scale-in ${
            feedback.isCorrect
              ? 'bg-emerald-500/20 border-2 border-emerald-500'
              : 'bg-destructive/20 border-2 border-destructive'
          }`}
        >
          <p className="text-xl font-bold">{feedback.message}</p>
        </div>
      )}

      {/* Answer Options */}
      <div className="flex-1 grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = player.current_answer === index;
          const showResult = player.has_answered;
          const isCorrect = index === currentQuestion.correctAnswer;

          let buttonClass = 'bg-card/50 border-primary/30 text-foreground';
          if (showResult) {
            if (isCorrect) {
              buttonClass = 'bg-emerald-500/30 border-emerald-500 text-emerald-100';
            } else if (isSelected && !isCorrect) {
              buttonClass = 'bg-destructive/30 border-destructive text-destructive-foreground';
            } else {
              buttonClass = 'bg-card/30 border-border/30 text-muted-foreground';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={player.has_answered || isSubmitting}
              className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${buttonClass} ${
                !player.has_answered && !isSubmitting
                  ? 'hover:border-primary hover:bg-primary/10 active:scale-98'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && <span className="text-xl">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="text-xl">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Team Score */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">Team Score</p>
        <p className="font-display text-2xl font-bold text-primary">
          {teamScore?.total_score || 0}
        </p>
      </div>
    </div>
  );
};

export default PlayerGame;
