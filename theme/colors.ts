export const lightColors = {
  background: {
    default: "#FFFAF5",
    secondary: "#F5EFE8",
    warm: "#FFFAF5",
  },

  header: {
    background: "#FFFAF5",
    text: "#111111",
    border: "#EDE5DC",
  },

  card: {
    default: "#FFFFFF",
  },

  text: {
    primary: "#111111",
    secondary: "#666666",
    muted: "#999999",
    inverse: "#FFFFFF",
  },

  border: {
    default: "#EDE5DC",
  },

  primary: {
    100: "#FFE5CC",
    300: "#FFB366",
    500: "#FF7A00", // main brand color
    700: "#CC5F00",
    900: "#993F00",
  },

  accent: {
    amber: "#F59E0B",
    amberText: "#92400E",
    amberBg: "#FEF3C7",
    coral: "#FF6B6B",
    coralText: "#991B1B",
    coralBg: "#FFE4E4",
    mint: "#10B981",
    mintText: "#065F46",
    mintBg: "#D1FAE5",
    blush: "#FFC2A1",
  },

  danger: {
    500: "#E53935",
  },
};

export const darkColors = {
  background: {
    default: "#0F0F0F",
    secondary: "#1A1A1A",
    warm: "#0F0F0F",
  },

  header: {
    background: "#1A1A1A",
    text: "#FFFFFF",
    border: "#2A2A2A",
  },

  card: {
    default: "#1E1E1E",
  },

  text: {
    primary: "#FFFFFF",
    secondary: "#AAAAAA",
    muted: "#777777",
    inverse: "#000000",
  },

  border: {
    default: "#2A2A2A",
  },

  primary: {
    100: "#FFD9B3",
    300: "#FFB366",
    500: "#FF9F43",
    700: "#E67E22",
    900: "#B35C00",
  },

  accent: {
    amber: "#92400E",
    amberText: "#FDE68A",
    amberBg: "#451A00",
    coral: "#7F1D1D",
    coralText: "#FCA5A5",
    coralBg: "#3A0A0A",
    mint: "#065F46",
    mintText: "#6EE7B7",
    mintBg: "#022C22",
    blush: "#7A3A20",
  },

  danger: {
    500: "#EF5350",
  },
};

export type ThemeColors = typeof lightColors;
