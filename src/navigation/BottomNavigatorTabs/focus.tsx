import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function FocusScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          专注模式
        </Text>
        <Text variant="bodyLarge">保持专注，提高效率</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
});
