import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import {
  Dialog,
  List,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

export interface SelectionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface SelectionDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  options: SelectionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function SelectionDialog({
  visible,
  onDismiss,
  title,
  options,
  selectedValue,
  onSelect,
}: SelectionDialogProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 弹出动画
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 消失动画
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const handleSelect = (value: string) => {
    onSelect(value);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={[
          styles.dialog,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <RadioButton.Group onValueChange={handleSelect} value={selectedValue}>
              {options.map((option, index) => (
                <TouchableRipple
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  rippleColor={theme.colors.surfaceVariant}
                  style={[
                    styles.radioItem,
                    selectedValue === option.value && {
                      backgroundColor: theme.colors.secondaryContainer,
                    },
                    index === 0 && styles.firstItem,
                    index === options.length - 1 && styles.lastItem,
                  ]}
                >
                  <View style={styles.radioItemContent}>
                    <View style={styles.radioItemLeft}>
                      {option.icon && (
                        <List.Icon
                          icon={option.icon}
                          color={
                            selectedValue === option.value
                              ? theme.colors.onSecondaryContainer
                              : theme.colors.onSurface
                          }
                        />
                      )}
                      <View
                        style={[
                          styles.radioTextContainer,
                          !option.icon && styles.radioTextContainerNoIcon,
                        ]}
                      >
                        <Text
                          variant="bodyLarge"
                          style={[
                            styles.radioTitle,
                            selectedValue === option.value && {
                              color: theme.colors.onSecondaryContainer,
                              fontWeight: "600",
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                        {option.description && (
                          <Text
                            variant="bodySmall"
                            style={{
                              color:
                                selectedValue === option.value
                                  ? theme.colors.onSecondaryContainer
                                  : theme.colors.onSurfaceVariant,
                            }}
                          >
                            {option.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    <RadioButton
                      value={option.value}
                      color={theme.colors.primary}
                      uncheckedColor={theme.colors.onSurfaceVariant}
                    />
                  </View>
                </TouchableRipple>
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Animated.View>
      </Dialog>
    </Portal>
  );
}

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 28,
    width: screenWidth - 48,
    maxWidth: 560,
    alignSelf: "center",
  },
  dialogTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  dialogContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  radioItem: {
    borderRadius: 16,
    marginVertical: 4,
    overflow: "hidden",
  },
  firstItem: {
    marginTop: 0,
  },
  lastItem: {
    marginBottom: 0,
  },
  radioItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 72,
  },
  radioItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  radioTextContainerNoIcon: {
    marginLeft: 16,
  },
  radioTitle: {
    marginBottom: 2,
  },
});
