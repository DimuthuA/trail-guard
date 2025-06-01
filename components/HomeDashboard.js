import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeDashboard() {
  const [isTracking, setIsTracking] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Home Screen content?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'justify',
    lineHeight: 24
  }
});
