// src/components/Card.tsx
import { View, ViewStyle, StyleProp } from 'react-native';
import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export default function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFF',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          marginBottom: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
