import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { ViewStyle } from "react-native";
import { ProgressBar as PaperProgressBar } from "react-native-paper";

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.gray200,
  height = 8,
  style,
}) => {
  return (
    <PaperProgressBar
      progress={Math.min(1, Math.max(0, progress / 100))}
      color={color}
      style={[
        {
          height,
          backgroundColor,
          borderRadius: BorderRadius.full,
          overflow: "hidden",
        },
        style,
      ]}
    />
  );
};
