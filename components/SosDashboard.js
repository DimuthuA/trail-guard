import { StyleSheet, Text, View } from 'react-native';

export default function SosDashboard() {
  return (
    <View style={styles.container}>
      <Text>No SOS functions available yet</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, margin: 10 },
});