import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  children: ReactNode;
}

export const Screen = ({ children }: Props) => {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {children}
    </SafeAreaView>
  );
};
