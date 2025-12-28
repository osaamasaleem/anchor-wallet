import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design was made for iPhone 12/13 - 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale function for width-based sizing
 * @param size - The size to scale
 * @returns Scaled size
 */
export const scale = (size: number) => {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size * scaleFactor);
};

/**
 * Scale function for height-based sizing
 * @param size - The size to scale
 * @returns Scaled size
 */
export const verticalScale = (size: number) => {
  const scaleFactor = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(size * scaleFactor);
};

/**
 * Moderate scale function with factor control
 * @param size - The size to scale
 * @param factor - Scaling factor (0-1), default 0.5
 * @returns Scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5) => {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size + (scaleFactor - 1) * size * factor);
};

// Responsive font sizes
export const fontSize = {
  xs: scale(10),
  sm: scale(12),
  base: scale(14),
  md: scale(16),
  lg: scale(18),
  xl: scale(20),
  '2xl': scale(24),
  '3xl': scale(32),
  '4xl': scale(48),
};

// Responsive spacing
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  '2xl': scale(40),
};

// Screen dimensions
export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
};

