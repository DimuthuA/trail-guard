export default ({ config }) => ({
  ...config,
  name: "Trail Guard",
  slug: "trail-guard",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "trailguard",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.oshnmdw.trailguard",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE",
    ],
    targetSdkVersion: 33,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-notifications",
    "expo-task-manager",
    [
      "expo-location",
      {
        // Explicit permissions
        locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to access your location even when the app is in the background.",
        locationWhenInUsePermission: "Allow $(PRODUCT_NAME) to access your location while you are using the app."
      }
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  owner: "oshnmdw",
  extra: {
    router: {},
    eas: {
        projectId: "675231cb-a267-454d-8347-872f1ba1e603"
    }
  },
});
