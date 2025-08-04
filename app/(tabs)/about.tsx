import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Constants from 'expo-constants';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

// This is the main component for our new "About" screen.
export default function AboutScreen() {
  // We use the expo-constants package to get the app version from the app.json file.
  // The '?.' is optional chaining, which prevents an error if expoConfig or version is not defined.
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  // This is the stubbed data version number, as you requested.
  const dataVersion = '2025.08.03.1';

  // This function will be called when the user presses the "Update Data" button.
  // For now, it just shows a placeholder alert.
  const handleUpdatePress = () => {
    Alert.alert("Update Data", "This feature will be implemented soon!");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Paint Catalogue</ThemedText>
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        <ThemedText>
          This app is designed to help miniature painters keep track of their paint collections. 
          Easily catalogue the paints you own so you always know what you have when you're at the hobby store.
        </ThemedText>
      </ThemedView>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>App Version:</ThemedText>
          <ThemedText style={styles.infoValue}>{appVersion}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Data Version:</ThemedText>
          <ThemedText style={styles.infoValue}>{dataVersion}</ThemedText>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleUpdatePress}>
        <ThemedText style={styles.buttonText}>Update Data</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

// Styles for the About screen to keep it looking clean and consistent.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  contentContainer: {
    marginBottom: 32,
  },
  infoContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
