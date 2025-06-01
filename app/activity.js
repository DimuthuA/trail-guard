import { StyleSheet, Text, View } from 'react-native';
import ActivityRecognition from '../components/ActivityRecognition';


export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Activity</Text>
       <ActivityRecognition />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1a1a1a', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20, marginTop: 10 },
});
