import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import colors from '../constants/colors';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'sos') iconName = 'alert-circle';
          else if (route.name === 'activity') iconName = 'walk';
          else if (route.name === 'settings') iconName = 'settings';

          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: colors.tabBarActiveTintColor,
        tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackgroundColor,
          height: 70,
          paddingTop: 6,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 0,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="sos" options={{ title: 'SOS' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
    </Tabs>
  );
}
