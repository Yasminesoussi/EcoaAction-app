import { ViewProps, TextProps, PressableProps, TextInputProps, FlatListProps } from 'react-native';
declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface FlatListProps<T> {
    className?: string;
  }
}
