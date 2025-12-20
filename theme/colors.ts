export const lightColors = {
    background: {
      default: "#FFFFFF",
      secondary: "#F8F8F8",
    },
  
    text: {
      primary: "#111111",
      secondary: "#666666",
      muted: "#999999",
      inverse: "#FFFFFF",
    },
  
    border: {
      default: "#E5E5E5",
    },
  
    primary: {
      100: "#FFE5CC",
      300: "#FFB366",
      500: "#FF7A00", // main brand color
      700: "#CC5F00",
      900: "#993F00",
    },
  
    danger: {
      500: "#E53935",
    },
  };
  
  export const darkColors = {
    background: {
      default: "#0F0F0F",
      secondary: "#1A1A1A",
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
  
    danger: {
      500: "#EF5350",
    },
  };
  
  export type ThemeColors = typeof lightColors;
  