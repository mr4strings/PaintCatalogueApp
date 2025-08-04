import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
// Import our reverted, asynchronous database functions
import { init, populateInitialData } from '@/services/database';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // The useEffect hook now uses async/await to handle the Promises from our db functions.
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await init();
        await populateInitialData(); // For prototype data
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed.', error);
        Alert.alert("Database Error", "Could not initialize the database.");
      }
    };
    
    setupDatabase();
  }, []); // The empty dependency array [] means this effect runs only once.


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
