import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          数据分析
        </Text>
        <Text variant="bodyLarge">查看您的使用数据和统计</Text>
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
