export const colors = {
  emerald: {
    900: "#054A29",
  },
  gold: {
    500: "#D4AF37",
  },
  cream: {
    50: "#FAF5E6",
  },
  charcoal: {
    900: "#1A1A1A",
  },
} as const;

export const brand = {
  name: "Caldera Luxury Travel",
  primary: colors.emerald[900],
  accent: colors.gold[500],
  background: colors.cream[50],
  foreground: colors.charcoal[900],
};

export type Brand = typeof brand;

