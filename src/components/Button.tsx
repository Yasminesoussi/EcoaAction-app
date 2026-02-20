// src/components/Button.tsx
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  onPress,
  disabled,
  children,
  style,
  variant = 'primary',
}: ButtonProps) {
  const colors = {
    primary: disabled ? '#D9B89E' : '#8C5B3F',
    secondary: '#F0E0D8',
  };
  return (
    <Pressable
      style={[
        {
          backgroundColor: colors[variant],
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: 'center',
        },
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={{ color: variant === 'primary' ? '#FFF' : '#8C5B3F', fontWeight: '600', fontSize: 16 }}>
        {children}
      </Text>
    </Pressable>
  );
}
