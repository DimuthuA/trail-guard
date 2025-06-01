import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import { uploadHikerData } from '../firebase/uploadService';
import { detectActivity, useActivityRecognizer } from '../modules/ActivityRecognizer';
import AccelerometerReader from './sensors/AccelerometerReader';
import LocationReader from './sensors/LocationReader';

export default function SosDashboard() {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);
  const { updateActivity } = useActivityRecognizer();
  const [loc, setLoc] = useState({});

  const activityInfo = useRef({
    label: 'unknown',
    startTime: Date.now(),
  });

  const localMags = useRef([]);

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(intervalRef.current);
            triggerSOS();
            return 'Done!';
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

  const triggerSOS = async () => {
    try {
      const stored = await AsyncStorage.getItem('emergencyContacts');
      const contactList = stored ? JSON.parse(stored) : [];
      const numbers = contactList.map(c => c.number);
      if (numbers.length === 0) {
        Alert.alert('No contacts', 'Please add at least one emergency contact in settings.');
        return;
      }

      const duration = Math.round((Date.now() - activityInfo.current.startTime) / 60000);
      const activityMsg = `${activityInfo.current.label} for ${duration} minute${duration !== 1 ? 's' : ''}`; 
      const coords = `https://maps.google.com/?q=${loc?.latitude},${loc?.longitude}`;

      await uploadHikerData("hiker123", {
        emergency: true,
        activity: activityMsg,
        location: coords,
      });

      const message = `🚨 SOS Alert!\nThe hiker may be in danger.\nActivity: ${activityMsg}\nLocation: ${coords}`;

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
        <Text style={styles.warning}>
          ⚠️ For emergency use only. Press and hold the SOS button. You will have 5 seconds to cancel.
        </Text>

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
          const newLabel = detectActivity(data, localMags);

          if (newLabel !== activityInfo.current.label) {
            activityInfo.current = {
              label: newLabel,
              startTime: Date.now(),
            };
          }

          updateActivity(data);
        }}

      />

      <LocationReader onLocation={setLoc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBackgroundColor,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 17,
    color: colors.secondaryTextColor,
    textAlign: 'justify',
    lineHeight: 24
  },
  bottomSection: {
    alignItems: 'center',
    bottom: 40
  },
  warning: {
    fontSize: 20,
    color: colors.warningTextColor,
    textAlign: 'center',
    marginBottom: 30,
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
    color: colors.primaryTextColor,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
