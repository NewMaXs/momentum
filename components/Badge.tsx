import { BorderRadius } from "@/constants/borderRadius";
import { Colors } from "@/constants/colors";
import { FontSizes } from "@/constants/fontSize";
import { Spacing } from "@/constants/spacing";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface BadgeProps {
  text: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "primary",
  size = "md",
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.full,
      alignItems: "center",
      justifyContent: "center",
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        minHeight: 20,
      },
      md: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        minHeight: 24,
      },
    };

    const variantStyles = {
      primary: { backgroundColor: Colors.primaryLight },
      secondary: { backgroundColor: Colors.gray200 },
      success: { backgroundColor: Colors.successLight },
      warning: { backgroundColor: Colors.warningLight },
      danger: { backgroundColor: Colors.dangerLight },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      sm: { fontSize: FontSizes.xs },
      md: { fontSize: FontSizes.sm },
    };

    const variantStyles = {
      primary: { color: Colors.primaryDark },
      secondary: { color: Colors.gray700 },
      success: { color: Colors.secondary },
      warning: { color: Colors.warning },
      danger: { color: Colors.danger },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      fontWeight: "600",
    };
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
};
