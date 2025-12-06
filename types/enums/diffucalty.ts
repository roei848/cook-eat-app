export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export const titlesToDifficulty: Record<Difficulty, string> = {
  [Difficulty.EASY]: "קל",
  [Difficulty.MEDIUM]: "בינוני",
  [Difficulty.HARD]: "קשה",
};
