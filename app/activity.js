import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActivityRecognition from '../components/ActivityRecognition';


export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>TrailGuard Activity Recognition</Text>
       <ActivityRecognition />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20 },
});
