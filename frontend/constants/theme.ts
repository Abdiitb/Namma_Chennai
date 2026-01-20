/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Theme Colors - Blue, Gray, White based on Final.svg design
export const ThemeColors = {
  primary: '#2174D4',
  primaryDark: '#016ACD',
  background: '#FAFAFA',
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#444444',
  textPrimary: '#656565',
  textSecondary: '#969696',
  textBold: '#313131',
  border: '#ECEDEF',
  overlay: 'rgba(150, 150, 150, 0.5)',
  error: '#EF4444',
  success: '#599839',
  yellow: '#FFD600',
  gray: '#6B7280',
  // Icon background colors
  iconBgGreen: '#EAF5E5',
  iconColorGreen: '#599839',
  iconBgYellow: '#FBF0D5',
  iconColorYellow: '#826B31',
  iconBgBlue: '#DEF7FC',
  iconColorBlue: '#3B8FA3',
  iconBgGray: '#F7F7F7',
};

const tintColorLight = ThemeColors.primary;
const tintColorDark = ThemeColors.primaryDark;

export const Colors = {
  light: {
    text: ThemeColors.textPrimary,
    background: ThemeColors.background,
    tint: tintColorLight,
    icon: ThemeColors.primary,
    tabIconDefault: ThemeColors.textSecondary,
    tabIconSelected: tintColorLight,
    card: ThemeColors.white,
    border: ThemeColors.border,
    primary: ThemeColors.primary,
    secondary: ThemeColors.textPrimary,
  },
  dark: {
    text: ThemeColors.white,
    background: ThemeColors.darkGray,
    tint: tintColorDark,
    icon: ThemeColors.primaryDark,
    tabIconDefault: ThemeColors.textSecondary,
    tabIconSelected: tintColorDark,
    card: ThemeColors.darkGray,
    border: ThemeColors.border,
    primary: ThemeColors.primaryDark,
    secondary: ThemeColors.white,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Navigation Theme for React Navigation
export const YellowBlackTheme = {
  dark: false,
  colors: {
    primary: ThemeColors.primary,
    background: ThemeColors.background,
    card: ThemeColors.white,
    text: ThemeColors.textPrimary,
    border: ThemeColors.border,
    notification: ThemeColors.primary,
  },
  fonts: {
    regular: {
      fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: Platform.select({ ios: 'System', default: 'sans-serif-medium' }),
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
      fontWeight: '900' as const,
    },
  },
};
