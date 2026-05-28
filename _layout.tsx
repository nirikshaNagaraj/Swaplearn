import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ removes "Expo Starter" + top bar
      }}
    />
  );
}