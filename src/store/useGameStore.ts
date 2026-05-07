import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  playerName: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  setPlayerName: (name: string) => void;
  addScore: (points: number) => void;
  recordAnswer: (isCorrect: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: '',
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
      setPlayerName: (name) => set({ playerName: name }),
      addScore: (points) => set((state) => ({ score: state.score + points })),
      recordAnswer: (isCorrect) => set((state) => {
        if (isCorrect) {
          const newStreak = state.streak + 1;
          const multiplier = newStreak >= 3 ? 1.5 : 1;
          return {
            streak: newStreak,
            correctAnswers: state.correctAnswers + 1,
            score: state.score + 100 * multiplier
          };
        } else {
          return {
            streak: 0,
            wrongAnswers: state.wrongAnswers + 1
          };
        }
      }),
      resetGame: () => set({ score: 0, correctAnswers: 0, wrongAnswers: 0, streak: 0 })
    }),
    {
      name: 'fraccionautas-storage',
    }
  )
);
