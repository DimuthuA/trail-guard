import { StyleSheet, Text, View } from 'react-native';
import SosDashboard from '../SosDashboard';

export default function SosScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>SOS</Text>
      <SosDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20 },
});