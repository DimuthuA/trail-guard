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
    package: "com.dimuthuamaraweera.trailguard",
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
  owner: "dimuthuamaraweera",
  extra: {
    router: {},
    eas: {
      projectId: "ba127ee3-8d4a-4c26-b2d1-cba103e12b8d",
    },
  },
});
