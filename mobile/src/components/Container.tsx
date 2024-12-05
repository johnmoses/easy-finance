import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  children: ReactNode;
}

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const Container = ({ children }: Props) => {
  return <View style={styles.container}>{children}</View>;
};

export const Centered = ({ children }: Props) => {
  return <View style={styles.centered}>{children}</View>;
};

export const ListsButton = ({ children }: ButtonProps) => {
  return <View style={styles.listButton}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  inputContainer: {
    flex: 9,
  },
  buttonContainer: {
    flex: 1,
  },
  input: {
    height: 35,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  headline: {
    textAlign: 'center',
  },
  listButton: {
    borderRadius: 2,
    // flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    // minWidth: '40%',
    // margin: 5,
    // elevation: 5,
    borderColor: 'blue',
    backgroundColor: 'gray',
  },
});
