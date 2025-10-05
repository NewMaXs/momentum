import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { Shadows } from "@/constants/shadows";
import { Spacing } from "@/constants/spacing";
import { StyleSheet, ViewStyle } from "react-native";
import { Card as PaperCard } from "react-native-paper";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = "md",
}) => {
  return (
    <PaperCard style={[styles.card, { padding: Spacing[padding] }, style]}>
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
});
