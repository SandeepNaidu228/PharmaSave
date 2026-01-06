import "../global.css"; // Ensure this import is here
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth & Onboarding Screens */}
      <Stack.Screen name="index" />
      <Stack.Screen name="save-on" />
      <Stack.Screen name="login" />
      
      {/* The Tab Navigator (This loads the (tabs) folder) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Pharmacy Dashboard (Route group for pharmacy owners) */}
      <Stack.Screen name="(pharmacy)" options={{ headerShown: false }} />
      
      {/* Details Screen (Stacks on top of everything) */}
      <Stack.Screen name="details" options={{ presentation: 'modal' }} /> 
    </Stack>
  );
}