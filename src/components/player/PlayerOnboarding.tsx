import { useState } from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TeamType } from '@/types/game';
import { TEAM_CONFIG } from '@/types/game';

interface PlayerOnboardingProps {
  onJoin: (alias: string, team: TeamType) => Promise<void>;
}

const PlayerOnboarding = ({ onJoin }: PlayerOnboardingProps) => {
  const [alias, setAlias] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!alias.trim() || !selectedTeam) return;
    setIsJoining(true);
    await onJoin(alias.trim(), selectedTeam);
    setIsJoining(false);
  };

  const teams: TeamType[] = ['ruby', 'sapphire', 'amber', 'emerald'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pattern-royal">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
          Enter the Arena
        </h1>
        <p className="text-muted-foreground">
          Choose your alias and pledge to a team
        </p>
      </div>

      {/* Alias Input */}
      <div className="w-full max-w-md mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Your Royal Alias
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your warrior name..."
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="pl-10 h-14 text-lg bg-card/50 border-primary/30 focus:border-primary"
            maxLength={20}
          />
        </div>
      </div>

      {/* Team Selection */}
      <div className="w-full max-w-md mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-muted-foreground mb-3">
          Choose Your Team
        </label>
        <div className="grid grid-cols-2 gap-3">
          {teams.map((team) => {
            const config = TEAM_CONFIG[team];
            const isSelected = selectedTeam === team;

            return (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? `${config.borderClass} bg-card shadow-lg scale-105`
                    : 'border-border bg-card/30 hover:border-primary/40'
                }`}
              >
                <div className="text-3xl mb-2">{config.emoji}</div>
                <p className="font-display font-bold text-foreground">{config.name}</p>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Join Button */}
      <Button
        onClick={handleJoin}
        disabled={!alias.trim() || !selectedTeam || isJoining}
        className="w-full max-w-md h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 animate-fade-in"
        style={{ animationDelay: '0.3s' }}
      >
        {isJoining ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⚔️</span>
            Entering Arena...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>👑</span>
            Join the Battle
          </span>
        )}
      </Button>
    </div>
  );
};

export default PlayerOnboarding;
