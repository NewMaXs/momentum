import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          仪表盘
        </Text>
        <Text variant="bodyLarge">欢迎使用 Momentum</Text>
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
