import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GameSession, Player, TeamScore, TeamType, GameState } from '@/types/game';
import { POINTS_PER_CORRECT, questions } from '@/data/questions';

export const useGameSession = () => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  // Get or create active session
  const initializeSession = useCallback(async () => {
    try {
      // Check for existing active session
      const { data: existingSessions, error: fetchError } = await supabase
        .from('game_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      let activeSession: GameSession;

      if (existingSessions && existingSessions.length > 0) {
        activeSession = existingSessions[0] as unknown as GameSession;
      } else {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('game_sessions')
          .insert([{ state: 'lobby' as GameState, current_question_index: 0 }])
          .select()
          .single();

        if (createError) throw createError;
        activeSession = newSession as unknown as GameSession;

        // Initialize team scores
        const teams: TeamType[] = ['ruby', 'sapphire', 'amber', 'emerald'];
        await supabase.from('team_scores').insert(
          teams.map((team) => ({
            session_id: activeSession.id,
            team,
            total_score: 0,
          }))
        );
      }

      setSession(activeSession);

      // Fetch players
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', activeSession.id);

      setPlayers((playersData as unknown as Player[]) || []);

      // Fetch team scores
      const { data: scoresData } = await supabase
        .from('team_scores')
        .select('*')
        .eq('session_id', activeSession.id);

      setTeamScores((scoresData as unknown as TeamScore[]) || []);
    } catch (error) {
      console.error('Error initializing session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    initializeSession();

    const sessionsChannel = supabase
      .channel('game-sessions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game_sessions' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setSession(payload.new as unknown as GameSession);
          }
        }
      )
      .subscribe();

    const playersChannel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers((prev) => [...prev, payload.new as unknown as Player]);
          } else if (payload.eventType === 'UPDATE') {
            setPlayers((prev) =>
              prev.map((p) => (p.id === (payload.new as any).id ? (payload.new as unknown as Player) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setPlayers((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    const scoresChannel = supabase
      .channel('team-scores-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_scores' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setTeamScores((prev) => {
              const existing = prev.find((s) => s.id === (payload.new as any).id);
              if (existing) {
                return prev.map((s) =>
                  s.id === (payload.new as any).id ? (payload.new as unknown as TeamScore) : s
                );
              }
              return [...prev, payload.new as unknown as TeamScore];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(scoresChannel);
    };
  }, [initializeSession]);

  // Join as player
  const joinGame = async (alias: string, team: TeamType): Promise<string | null> => {
    if (!session) return null;

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([
          {
            session_id: session.id,
            alias,
            team,
            score: 0,
            has_answered: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const playerId = (data as any).id;
      setCurrentPlayerId(playerId);
      localStorage.setItem('playerId', playerId);
      return playerId;
    } catch (error) {
      console.error('Error joining game:', error);
      return null;
    }
  };

  // Submit answer
  const submitAnswer = async (playerId: string, answerIndex: number) => {
    if (!session) return;

    const currentQuestion = questions[session.current_question_index];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const player = players.find((p) => p.id === playerId);

    if (!player) return;

    try {
      // Update player
      const newScore = isCorrect ? player.score + POINTS_PER_CORRECT : player.score;
      await supabase
        .from('players')
        .update({
          current_answer: answerIndex,
          has_answered: true,
          score: newScore,
        })
        .eq('id', playerId);

      // Update team score if correct
      if (isCorrect) {
        const teamScore = teamScores.find((s) => s.team === player.team);
        if (teamScore) {
          await supabase
            .from('team_scores')
            .update({ total_score: teamScore.total_score + POINTS_PER_CORRECT })
            .eq('id', teamScore.id);
        }
      }

      return isCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      return false;
    }
  };

  // Controller: Start game
  const startGame = async () => {
    if (!session) return;
    await supabase
      .from('game_sessions')
      .update({ state: 'playing' as GameState, current_question_index: 0 })
      .eq('id', session.id);

    // Reset all players
    await supabase
      .from('players')
      .update({ has_answered: false, current_answer: null })
      .eq('session_id', session.id);
  };

  // Controller: Next question
  const nextQuestion = async () => {
    if (!session) return;

    const nextIndex = session.current_question_index + 1;

    if (nextIndex >= questions.length) {
      // Game over
      await supabase
        .from('game_sessions')
        .update({ state: 'results' as GameState })
        .eq('id', session.id);
    } else {
      // Reset players and move to next question
      await supabase
        .from('players')
        .update({ has_answered: false, current_answer: null })
        .eq('session_id', session.id);

      await supabase
        .from('game_sessions')
        .update({ current_question_index: nextIndex })
        .eq('id', session.id);
    }
  };

  // Controller: Reset game
  const resetGame = async () => {
    if (!session) return;

    // Delete all players
    await supabase.from('players').delete().eq('session_id', session.id);

    // Reset team scores
    await supabase
      .from('team_scores')
      .update({ total_score: 0 })
      .eq('session_id', session.id);

    // Reset session
    await supabase
      .from('game_sessions')
      .update({ state: 'lobby' as GameState, current_question_index: 0 })
      .eq('id', session.id);

    setPlayers([]);
  };

  return {
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
  };
};
