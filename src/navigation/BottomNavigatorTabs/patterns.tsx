import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function PatternsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          定式树
        </Text>
        <Text variant="bodyLarge">查看和学习定式模式</Text>
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
