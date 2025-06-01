import { StyleSheet, Text, View } from 'react-native';
import SosDashboard from '../components/SosDashboard';

export default function SosScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>SOS</Text>
      <SosDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1a1a1a', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20, marginTop: 10 },
});