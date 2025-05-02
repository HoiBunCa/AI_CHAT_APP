import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
export const lightTheme = {
  background: '#FFFFFF',
  card: '#F9FAFB',
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#F97316',
  text: '#1F2937',
  secondaryText: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#FBBF24',
  error: '#EF4444',
  inputBackground: '#F3F4F6',
  messageBubbleUser: '#3B82F6',
  messageBubbleAI: '#F3F4F6',
  messageBubbleUserText: '#FFFFFF',
  messageBubbleAIText: '#1F2937',
};

export const darkTheme = {
  background: '#111827',
  card: '#1F2937',
  primary: '#60A5FA',
  secondary: '#A78BFA',
  accent: '#FB923C',
  text: '#F9FAFB',
  secondaryText: '#9CA3AF',
  border: '#374151',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  inputBackground: '#374151',
  messageBubbleUser: '#60A5FA',
  messageBubbleAI: '#1F2937',
  messageBubbleUserText: '#FFFFFF',
  messageBubbleAIText: '#F9FAFB',
};

type Theme = typeof lightTheme;
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  
  // Determine if we should use dark theme
  const isDark = themeMode === 'system' 
    ? colorScheme === 'dark'
    : themeMode === 'dark';
  
  // Set the current theme based on isDark
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};