import { SPACING } from "@/constants/app";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export interface StatItemProps {
    value: string | number;
    label: string;
    icon?: string;
    iconColor?: string;
    valueColor?: string;
}

const StatItem: React.FC<StatItemProps> = ({
    value,
    label,
    icon,
    iconColor,
    valueColor,
}) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            {icon && (
                <Icon
                    source={icon}
                    size={32}
                    color={iconColor || theme.colors.primary}
                />
            )}
            <Text
                variant={icon ? "headlineMedium" : "displaySmall"}
                style={[
                    styles.value,
                    { color: valueColor || theme.colors.primary },
                    !icon && styles.valueNoIcon,
                ]}
            >
                {value}
            </Text>
            <Text
                variant="bodySmall"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        paddingVertical: SPACING.MD,
    },
    value: {
        marginTop: SPACING.SM,
        marginBottom: SPACING.XS,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
    },
    valueNoIcon: {
        marginTop: 0,
    },
    label: {
        textAlign: "center",
        lineHeight: 16,
    },
});

export default React.memo(StatItem);
