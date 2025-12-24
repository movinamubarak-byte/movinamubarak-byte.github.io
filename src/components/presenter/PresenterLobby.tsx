import type { Player, TeamScore } from '@/types/game';
import { TEAM_CONFIG, TeamType } from '@/types/game';

interface PresenterLobbyProps {
  players: Player[];
  teamScores: TeamScore[];
}

const PresenterLobby = ({ players }: PresenterLobbyProps) => {
  const teams: TeamType[] = ['ruby', 'sapphire', 'amber', 'emerald'];

  const getTeamPlayers = (team: TeamType) => players.filter((p) => p.team === team);

  return (
    <div className="min-h-screen flex flex-col p-8 pattern-royal">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-display text-6xl md:text-8xl font-bold text-gradient-gold mb-4">
          Puzzle-e-Sultan
        </h1>
        <p className="text-muted-foreground text-xl md:text-2xl">
          The Royal Quiz Arena
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <span className="text-3xl">👑</span>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent self-center" />
          <span className="text-3xl">⚔️</span>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent self-center" />
          <span className="text-3xl">👑</span>
        </div>
      </div>

      {/* Waiting Message */}
      <div className="text-center mb-12 animate-pulse">
        <p className="text-2xl text-primary font-medium">
          ⏳ Warriors are gathering...
        </p>
        <p className="text-muted-foreground mt-2">
          {players.length} warrior{players.length !== 1 ? 's' : ''} in the arena
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-4 gap-6 flex-1">
        {teams.map((team, index) => {
          const config = TEAM_CONFIG[team];
          const teamPlayers = getTeamPlayers(team);

          return (
            <div
              key={team}
              className="bg-card/30 rounded-2xl border-2 border-primary/20 p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Team Header */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">{config.emoji}</div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {config.name}
                </h3>
                <p className="text-primary font-bold text-lg mt-1">
                  {teamPlayers.length} warrior{teamPlayers.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Player List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {teamPlayers.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm italic">
                    Awaiting warriors...
                  </p>
                ) : (
                  teamPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="bg-card/50 rounded-lg px-3 py-2 text-center animate-scale-in"
                    >
                      <span className="text-foreground font-medium">{player.alias}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Instructions */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Waiting for the Vizier to <span className="text-primary">Awaken the Sultan</span>
        </p>
      </div>
    </div>
  );
};

export default PresenterLobby;
