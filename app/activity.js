import { StyleSheet, Text, View } from 'react-native';
import ActivityDashboard from '../components/ActivityDashboard';
import colors from '../constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Activity</Text>
      </View>
      <ActivityDashboard />
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
