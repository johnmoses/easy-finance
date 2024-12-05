import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

export const PageLoading = ({ children }: Props) => {
  return <View style={[styles.loading]}>{children}</View>;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
