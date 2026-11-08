/**
 * CONSTANTES DE DESIGN
 * Couleurs, espacements, typos pour toute l'app
 */

export const COLORS = {
  // Couleurs primaires
  PRIMARY: '#2E7D32',
  PRIMARY_LIGHT: '#66BB6A',
  PRIMARY_DARK: '#1B5E20',

  // Couleurs de sévérité
  INFO: '#1976D2',
  SUCCESS: '#388E3C',
  WARNING: '#F57C00',
  DANGER: '#D32F2F',

  // Neutres
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#FAFAFA',
  GRAY_100: '#F5F5F5',
  GRAY_300: '#E0E0E0',
  GRAY_500: '#9E9E9E',
  GRAY_700: '#616161',
  GRAY_900: '#212121',

  // Texte
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  TEXT_LIGHT: '#BDBDBD',
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
};

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999,
};

export const TYPOGRAPHY = {
  H1: { fontSize: 32, fontWeight: 'bold' as const },
  H2: { fontSize: 28, fontWeight: 'bold' as const },
  H3: { fontSize: 24, fontWeight: 'bold' as const },
  H4: { fontSize: 20, fontWeight: 'bold' as const },
  TITLE: { fontSize: 18, fontWeight: '600' as const },
  SUBTITLE: { fontSize: 16, fontWeight: '500' as const },
  BODY: { fontSize: 14, fontWeight: '400' as const },
  CAPTION: { fontSize: 12, fontWeight: '400' as const },
};

export const SHADOWS = {
  LIGHT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  DARK: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};
