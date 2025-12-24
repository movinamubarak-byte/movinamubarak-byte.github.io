import { Crown, Monitor, Settings } from 'lucide-react';
import type { RoleType } from '@/types/game';

interface RoleSelectorProps {
  onSelectRole: (role: RoleType) => void;
}

const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  const roles = [
    {
      type: 'player' as RoleType,
      title: 'Player',
      subtitle: 'Join the Battle',
      description: 'Enter the arena and compete for glory',
      icon: Crown,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      type: 'presenter' as RoleType,
      title: 'Presenter',
      subtitle: 'The Grand Stage',
      description: 'Display for the royal audience',
      icon: Monitor,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      type: 'controller' as RoleType,
      title: 'Vizier',
      subtitle: 'Control Room',
      description: 'Command the game flow',
      icon: Settings,
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pattern-royal">
      {/* Title */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient-gold mb-4">
          Puzzle-e-Sultan
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          The Royal Quiz Arena
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-2xl">👑</span>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent self-center" />
          <span className="text-2xl">⚔️</span>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent self-center" />
          <span className="text-2xl">👑</span>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
        {roles.map((role, index) => (
          <button
            key={role.type}
            onClick={() => onSelectRole(role.type)}
            className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-card/50 backdrop-blur-sm p-6 text-left transition-all duration-300 hover:border-primary/60 hover:shadow-gold hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient overlay on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-lg bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <role.icon className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <h3 className="font-display text-2xl font-bold text-foreground mb-1">
              {role.title}
            </h3>
            <p className="text-primary font-medium text-sm mb-2">
              {role.subtitle}
            </p>
            <p className="text-muted-foreground text-sm">
              {role.description}
            </p>

            {/* Arrow indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-primary text-xl">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-12 text-muted-foreground/60 text-sm">
        Select your role to enter the arena
      </p>
    </div>
  );
};

export default RoleSelector;
