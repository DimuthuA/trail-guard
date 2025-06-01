import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { uploadHikerData } from '../firebase/uploadService';
import { useActivityRecognizer } from '../modules/ActivityRecognizer';
import AccelerometerReader from './sensors/AccelerometerReader';
import LocationReader from './sensors/LocationReader';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SosDashboard() {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);
  const { activity, updateActivity } = useActivityRecognizer();
  const [loc, setLoc] = useState({});

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(intervalRef.current);
            triggerSOS();
            return "Done!";
          }
          return c - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setCountdown(5);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHolding]);

  const coords = {
    latitude: loc?.latitude,
    longitude: loc?.longitude,
  };

  const triggerSOS = async () => {
    try {
      const stored = await AsyncStorage.getItem('emergencyContacts');
      const contactList = stored ? JSON.parse(stored) : [];
      const numbers = contactList.map(c => c.number);
      if (numbers.length === 0) {
        Alert.alert('No contacts', 'Please add at least one emergency contact in settings.');
        return;
      }

      await uploadHikerData("hiker123", {
        emergency: true,
        activity: activity,
        location: `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
      });

      const message = `🚨 SOS Alert!\nThe hiker may be in danger.\nActivity: ${activity}\nLocation: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(numbers, message);
      } else {
        Alert.alert("SMS Unavailable", "Your device cannot send text messages.");
      }

      Alert.alert("SOS Triggered!", "Emergency alert sent and SMS prepared.");
    } catch (error) {
      Alert.alert("Error", "Failed to send SOS alert.");
      console.error(error);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        When you press the SOS button below, the following parties will be notified that you may need urgent help:
        {"\n\n"}• Emergency Services
        {"\n"}• Registered Trail Organization
        {"\n"}• Your Emergency Contacts
      </Text>

      <View style={styles.bottomSection}>
        <Text style={styles.warning}>⚠️ For emergency use only. Press and hold the SOS button. You will have 5 seconds to cancel.</Text>

        <TouchableOpacity
          style={[styles.sosButton, isHolding && styles.sosButtonActive]}
          onPressIn={() => setIsHolding(true)}
          onPressOut={() => setIsHolding(false)}
        >
          <Text style={styles.sosButtonText}>
            {isHolding ? countdown : 'SOS'}
          </Text>
        </TouchableOpacity>
      </View>
      <AccelerometerReader
        onData={(data) => {
          updateActivity(data);
        }}
      />
      <LocationReader onLocation={setLoc}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  },
  bottomSection: {
    alignItems: 'center',
    bottom: 40
  },
  warning: {
    fontSize: 18,
    color: '#ffcc00',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 24
  },
  sosButton: {
  width: 180,
  height: 180,
  borderRadius: 90,
  backgroundColor: '#ff3b30',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#ff3b30',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.4,
  shadowRadius: 20,
  elevation: 12,
  transform: [{ scale: 1.05 }],
  },

  sosButtonActive: {
    backgroundColor: '#cc0000',
    transform: [{ scale: 1.1 }],
  },

  sosButtonText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

});
