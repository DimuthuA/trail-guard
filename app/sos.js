import { StyleSheet, Text, View } from 'react-native';
import SosDashboard from '../components/SosDashboard';
import colors from '../constants/colors';

export default function SosScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>SOS</Text>
      </View>
      <SosDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.titleBarBackgroundColor,
  },
  titleBar: {
    backgroundColor: colors.titleBarBackgroundColor,
    borderBottomColor: colors.titleBarBorderColor,
    borderBottomWidth: 1,
    paddingTop: 48,
    paddingBottom: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: colors.titleBarTextColor,
  },
});