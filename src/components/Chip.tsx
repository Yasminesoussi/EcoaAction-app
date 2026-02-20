import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export default function Chip({ label, selected = false, onPress, className }: ChipProps) {
  const bg = selected ? 'bg-nude-700' : 'bg-nude-100';
  const text = selected ? 'text-white' : 'text-nude-800';
  return (
    <Pressable className={`px-3 py-2 rounded-xl ${bg} ${className || ''}`} onPress={onPress}>
      <Text className={`font-medium ${text}`}>{label}</Text>
    </Pressable>
  );
}
