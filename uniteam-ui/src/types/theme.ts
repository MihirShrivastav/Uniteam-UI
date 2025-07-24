export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    neutral: ColorScale;
    semantic: SemanticColors;
  };
  typography: TypographyScale;
  spacing: SpacingScale;
  shadows: ShadowScale;
  borderRadius: BorderRadiusScale;
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

export interface TypographyScale {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: [string, { lineHeight: string; letterSpacing: string }];
    sm: [string, { lineHeight: string; letterSpacing: string }];
    base: [string, { lineHeight: string; letterSpacing: string }];
    lg: [string, { lineHeight: string; letterSpacing: string }];
    xl: [string, { lineHeight: string; letterSpacing: string }];
    '2xl': [string, { lineHeight: string; letterSpacing: string }];
    '3xl': [string, { lineHeight: string; letterSpacing: string }];
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ShadowScale {
  soft: string;
  medium: string;
  large: string;
}

export interface BorderRadiusScale {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}