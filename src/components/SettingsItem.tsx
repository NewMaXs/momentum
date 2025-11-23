import { SPACING } from "@/constants/app";
import React from "react";
import { StyleSheet, View } from "react-native";
import { List, Text, TouchableRipple, useTheme } from "react-native-paper";

export interface SettingsItemProps {
  title: string;
  description?: string;
  leftIcon: string;
  leftIconColor?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  description,
  leftIcon,
  leftIconColor,
  onPress,
  rightElement,
  showChevron,
}) => {
  const theme = useTheme();

  const Content = (
    <View style={styles.content}>
      <View style={styles.leftContent}>
        <List.Icon
          icon={leftIcon}
          color={leftIconColor || theme.colors.onSurfaceVariant}
        />
        <View style={styles.textContainer}>
          <Text variant="bodyLarge" style={styles.title}>
            {title}
          </Text>
          {description && (
            <Text
              variant="bodySmall"
              style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
      {showChevron && <List.Icon icon="chevron-right" />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableRipple
        onPress={onPress}
        rippleColor={theme.colors.surfaceVariant}
        style={styles.container}
      >
        {Content}
      </TouchableRipple>
    );
  }

  return <View style={styles.container}>{Content}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.XS,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.MD, // Assuming standard padding is needed inside the item if not provided by parent
    // But looking at SettingsScreen, padding is on contentContainer. 
    // However, TouchableRipple needs to span full width usually?
    // In SettingsScreen, listItem has paddingVertical.
    // Let's adjust. SettingsScreen uses `listItemContent` which has padding? No, `listItem` has paddingVertical.
    // `listItemContent` has no padding.
    // But `SettingsScreen` is inside a Card.
    // Let's remove paddingHorizontal here if the parent Card handles it?
    // Wait, `TouchableRipple` in `SettingsScreen` wraps `listItemContent`.
    // And `listItem` has `paddingVertical: SPACING.XS`.
    // So `TouchableRipple` should probably be the outer container.
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.SM,
  },
  title: {
    marginBottom: 2,
  },
  description: {
    lineHeight: 16,
  },
});

export default React.memo(SettingsItem);
