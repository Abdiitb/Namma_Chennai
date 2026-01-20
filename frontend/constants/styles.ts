import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#2174D4',
  primaryDark: '#016ACD',
  background: '#FAFAFA',
  cardBackground: '#FFFFFF',
  darkBackground: '#444444',
  textPrimary: '#656565',
  textSecondary: '#969696',
  textBold: '#313131',
  border: '#ECEDEF',
  shadow: 'rgba(0, 0, 0, 0.04)',
  shadowLight: 'rgba(0, 0, 0, 0.02)',
  shadowMedium: 'rgba(0, 0, 0, 0.03)',
  overlay: 'rgba(150, 150, 150, 0.5)',
  white: '#FFFFFF',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  // Icon background colors
  iconBgGreen: '#EAF5E5',
  iconColorGreen: '#599839',
  iconBgYellow: '#FBF0D5',
  iconColorYellow: '#826B31',
  iconBgBlue: '#DEF7FC',
  iconColorBlue: '#3B8FA3',
  iconBgGray: '#F7F7F7',
};

export const typography = {
  fontFamilyPrimary: 'Inter Display',
  fontFamilySecondary: 'Area Normal',
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40
};

export const borderRadius = {
  small: 2,
  medium: 12,
  large: 20,
  full: 9999
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 5
  }
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium
  },
  cardCompact: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
    ...shadows.small
  },
  textPrimary: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeightSemiBold
  },
  textSecondary: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeightRegular
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeightSemiBold
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary
  },
  header: {
    backgroundColor: colors.cardBackground,
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    ...shadows.medium
  },
  scrollContainer: {
    backgroundColor: colors.background,
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  section: {
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.lg
  }
});