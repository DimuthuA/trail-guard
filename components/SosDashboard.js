import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SosDashboard() {
  const handleSOSPress = () => {
    // TODO
    alert('SOS Triggered!');
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
        <Text style={styles.warning}>⚠️ For emergency use only. Pressing this button will alert rescue services.</Text>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
      </View>

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
    backgroundColor: '#ff3b30',
    paddingVertical: 20,
    paddingHorizontal: 56,
    borderRadius: 78,
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
