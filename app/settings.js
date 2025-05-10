import { StyleSheet, Text, View } from 'react-native';
import SettingsDashboard from '../components/SettingsDashboard';

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <SettingsDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20 },
});