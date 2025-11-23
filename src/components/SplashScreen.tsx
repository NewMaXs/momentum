import * as React from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";
import { ActivityIndicator, MD3Theme } from "react-native-paper";

const LOGO_SIZE = 96;
const APP_NAME = "Momentum";

interface SplashScreenProps {
    visible: boolean;
    fadeAnim: Animated.Value;
    scaleAnim: Animated.Value;
    theme: MD3Theme;
}

/**
 * 启动屏幕组件
 *
 * 显示应用 Logo 和加载指示器
 */
const SplashScreen: React.FC<SplashScreenProps> = React.memo(
    ({ visible, fadeAnim, scaleAnim, theme }) => {
        if (!visible) return null;

        const containerStyle = [
            styles.splashContainer,
            {
                backgroundColor: theme.colors.background,
                opacity: fadeAnim,
            },
        ];

        return (
            <Animated.View style={containerStyle}>
                <Animated.View
                    style={{
                        alignItems: "center",
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <Image
                        source={require("@/assets/icon/origin/momentum-256.png")}
                        style={[styles.icon, { tintColor: theme.colors.primary }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.appName, { color: theme.colors.onBackground }]}>
                        {APP_NAME}
                    </Text>
                </Animated.View>
                <ActivityIndicator
                    animating
                    size="small"
                    color={theme.colors.primary}
                    style={styles.activityIndicator}
                />
            </Animated.View>
        );
    },
);

if (__DEV__) {
    SplashScreen.displayName = "SplashScreen";
}

const styles = StyleSheet.create({
    splashContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    icon: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        marginBottom: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    activityIndicator: {
        marginTop: 24,
    },
});

export default SplashScreen;
