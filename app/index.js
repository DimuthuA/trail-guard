import { StyleSheet, Text, View } from 'react-native';
import SensorDashboard from '../components/SensorDashboard';


export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>All Sensor Data</Text>
       <SensorDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20 },
});
