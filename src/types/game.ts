export type TeamType = 'ruby' | 'sapphire' | 'amber' | 'emerald';
export type GameState = 'lobby' | 'playing' | 'results';
export type RoleType = 'player' | 'presenter' | 'controller';

export interface Player {
  id: string;
  session_id: string;
  alias: string;
  team: TeamType;
  score: number;
  current_answer: number | null;
  has_answered: boolean;
  created_at: string;
}

export interface GameSession {
  id: string;
  state: GameState;
  current_question_index: number;
  created_at: string;
  updated_at: string;
}

export interface TeamScore {
  id: string;
  session_id: string;
  team: TeamType;
  total_score: number;
}

export const TEAM_CONFIG: Record<TeamType, { name: string; emoji: string; colorClass: string; borderClass: string }> = {
  ruby: { name: 'Ruby Warriors', emoji: '🔴', colorClass: 'bg-team-ruby', borderClass: 'border-team-ruby' },
  sapphire: { name: 'Sapphire Knights', emoji: '🔵', colorClass: 'bg-team-sapphire', borderClass: 'border-team-sapphire' },
  amber: { name: 'Amber Sultans', emoji: '🟡', colorClass: 'bg-team-amber', borderClass: 'border-team-amber' },
  emerald: { name: 'Emerald Guardians', emoji: '🟢', colorClass: 'bg-team-emerald', borderClass: 'border-team-emerald' },
};

export const HINGLISH_FEEDBACK = {
  correct: [
    "Sahi Pakde Hain! 🎯",
    "Waah! Kya Baat Hai! 🌟",
    "Ekdum Correct! 💪",
    "Sultan Approved! 👑",
    "Shabaash! 🔥",
  ],
  incorrect: [
    "Arre Bhai, Galat! 😅",
    "Oops! Thoda Focus Karo! 🤔",
    "Koi Nahi, Agli Baar! 💫",
    "Thoda Sa Miss! 😬",
    "Try Harder Next Time! 💪",
  ],
  waiting: [
    "Soch Lo, Time Kam Hai! ⏰",
    "Jaldi Karo, Sultan! ⚡",
    "Tick Tock! 🕐",
  ],
};
