import type { Player, TeamScore } from '@/types/game';
import { TEAM_CONFIG } from '@/types/game';

interface PresenterResultsProps {
  players: Player[];
  teamScores: TeamScore[];
}

const PresenterResults = ({ players, teamScores }: PresenterResultsProps) => {
  // Sort teams by score (descending)
  const sortedTeams = [...teamScores].sort((a, b) => b.total_score - a.total_score);
  const winner = sortedTeams[0];
  const runnerUp = sortedTeams[1];
  const second = sortedTeams[2];
  const third = sortedTeams[3];

  const podiumOrder = [runnerUp, winner, second]; // 2nd, 1st, 3rd for visual podium

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pattern-royal overflow-hidden relative">
      {/* Confetti effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'][i % 4],
              animation: `confetti ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Trophy Header */}
      <div className="text-center mb-12 animate-fade-in z-10">
        <div className="text-8xl mb-4 animate-trophy-bounce">🏆</div>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-gradient-gold mb-4">
          Battle Complete!
        </h1>
        <p className="text-muted-foreground text-2xl">
          The arena has spoken...
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 mb-12 z-10">
        {podiumOrder.map((teamScore, index) => {
          if (!teamScore) return null;

          const config = TEAM_CONFIG[teamScore.team];
          const position = index === 1 ? 1 : index === 0 ? 2 : 3;
          const heights = ['h-32', 'h-48', 'h-24'];
          const delays = ['0.3s', '0.1s', '0.5s'];
          const teamPlayers = players.filter((p) => p.team === teamScore.team);

          return (
            <div
              key={teamScore.team}
              className="flex flex-col items-center animate-fade-in"
              style={{ animationDelay: delays[index] }}
            >
              {/* Team Info */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">
                  {config.emoji}
                  {position === 1 && <span className="ml-2">👑</span>}
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {config.name}
                </h3>
                <p className="font-display text-4xl font-bold text-primary">
                  {teamScore.total_score}
                </p>
                <p className="text-muted-foreground text-sm">
                  {teamPlayers.length} warriors
                </p>
              </div>

              {/* Podium Base */}
              <div
                className={`w-40 ${heights[index]} rounded-t-xl bg-gradient-to-b from-primary/40 to-primary/20 border-2 border-primary/30 flex items-center justify-center`}
              >
                <span className="font-display text-5xl font-bold text-primary/50">
                  {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fourth Place */}
      {third && (
        <div className="text-center mb-8 z-10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <p className="text-muted-foreground">4th Place</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl">{TEAM_CONFIG[third.team].emoji}</span>
            <span className="font-display text-lg font-bold text-foreground">
              {TEAM_CONFIG[third.team].name}
            </span>
            <span className="text-muted-foreground">—</span>
            <span className="font-bold text-primary">{third.total_score} pts</span>
          </div>
        </div>
      )}

      {/* Winner Announcement */}
      {winner && (
        <div className="text-center z-10 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <p className="text-2xl text-muted-foreground mb-2">The Champions</p>
          <div className="inline-flex items-center gap-3 bg-card/50 rounded-full px-8 py-4 border-2 border-primary animate-pulse-gold">
            <span className="text-4xl">{TEAM_CONFIG[winner.team].emoji}</span>
            <span className="font-display text-3xl font-bold text-gradient-gold">
              {TEAM_CONFIG[winner.team].name}
            </span>
            <span className="text-4xl">👑</span>
          </div>
        </div>
      )}

      {/* Total Warriors */}
      <p className="mt-12 text-muted-foreground z-10">
        {players.length} brave warriors competed in this battle
      </p>
    </div>
  );
};

export default PresenterResults;
