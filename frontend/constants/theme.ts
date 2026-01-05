/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Theme Colors - Black, Yellow, White
export const ThemeColors = {
  black: '#000000',
  yellow: '#FFD600',
  white: '#FFFFFF',
  darkGray: '#1A1A1A',
  lightGray: '#F5F5F5',
  gray: '#6B7280',
  error: '#EF4444',
  success: '#22C55E',
};

const tintColorLight = ThemeColors.yellow;
const tintColorDark = ThemeColors.yellow;

export const Colors = {
  light: {
    text: ThemeColors.black,
    background: ThemeColors.white,
    tint: tintColorLight,
    icon: ThemeColors.yellow,
    tabIconDefault: ThemeColors.gray,
    tabIconSelected: tintColorLight,
    card: ThemeColors.white,
    border: ThemeColors.yellow,
    primary: ThemeColors.yellow,
    secondary: ThemeColors.black,
  },
  dark: {
    text: ThemeColors.white,
    background: ThemeColors.black,
    tint: tintColorDark,
    icon: ThemeColors.yellow,
    tabIconDefault: ThemeColors.gray,
    tabIconSelected: tintColorDark,
    card: ThemeColors.darkGray,
    border: ThemeColors.yellow,
    primary: ThemeColors.yellow,
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
  dark: true,
  colors: {
    primary: ThemeColors.yellow,
    background: ThemeColors.black,
    card: ThemeColors.darkGray,
    text: ThemeColors.white,
    border: ThemeColors.yellow,
    notification: ThemeColors.yellow,
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
