import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SensorReader } from '../components/SensorReader';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>TrailGuard Sensor Module</Text>
      <SensorReader />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20 },
});
