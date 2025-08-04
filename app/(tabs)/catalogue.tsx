import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useIsFocused } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Image, Modal, Pressable, StyleSheet, View } from 'react-native';

// Import our reverted, asynchronous database functions
import { IconSymbol } from '@/components/ui/IconSymbol';
import { addOrUpdateUserPaint, decrementOrDeleteUserPaint, findPaintByBarcode, getUserLibraryPaints, UserPaint } from '@/services/database';

export default function CatalogueScreen() {
  const [paints, setPaints] = useState<UserPaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'success', message: string} | null>(null);

  const isFocused = useIsFocused();

  // loadPaints is now an async function to handle the Promise from getUserLibraryPaints.
  const loadPaints = async () => {
    setIsLoading(true);
    try {
      const fetchedPaints = await getUserLibraryPaints();
      setPaints(fetchedPaints);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not load paint library.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadPaints();
    }
  }, [isFocused]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  // This handler is now async to await the results from our db functions.
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScannerVisible(false);
    setStatusMessage(null);
    try {
      const paint = await findPaintByBarcode(data);
      if (paint) {
        await addOrUpdateUserPaint(paint.id);
        setStatusMessage({ type: 'success', message: `${paint.name} added to library!` });
        await loadPaints();
      } else {
        setStatusMessage({ type: 'error', message: 'Sorry, we could not identify this paint.' });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', message: 'An error occurred while adding the paint.' });
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleAddPress = () => {
    if (hasPermission === false) {
      setStatusMessage({ type: 'error', message: 'No access to camera. Please enable it in your settings.'});
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }
    setScannerVisible(true);
  };

  // The delete handler is now async.
  const handleDeletePress = (item: UserPaint) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to remove one '${item.name}'?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => {
            try {
              await decrementOrDeleteUserPaint(item.id);
              await loadPaints();
            } catch (error) {
              console.error("Failed to delete paint", error);
              Alert.alert("Error", "Could not remove paint from library.");
            }
        }}
      ]
    );
  };

  const renderPaintItem = ({ item }: { item: UserPaint }) => (
    <View style={styles.row}>
      <View style={styles.cellImage}>
        <Image 
            source={{ uri: item.imageUrl || 'https://placehold.co/40x40/cccccc/ffffff?text=N/A' }} 
            style={styles.paintImage} 
        />
      </View>
      <ThemedText style={styles.cellName}>{item.name}</ThemedText>
      <ThemedText style={styles.cellBrand}>{item.brand}</ThemedText>
      <ThemedText style={styles.cellQty}>{item.quantity}</ThemedText>
      <View style={styles.cellAction}>
        <Pressable onPress={() => handleDeletePress(item)}>
          <IconSymbol name="trash" size={24} color="#ff3b30" />
        </Pressable>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <ThemedText style={[styles.headerText, styles.cellImage]}></ThemedText>
      <ThemedText style={[styles.headerText, styles.cellName]}>Name</ThemedText>
      <ThemedText style={[styles.headerText, styles.cellBrand]}>Brand</ThemedText>
      <ThemedText style={[styles.headerText, styles.cellQty]}>Qty</ThemedText>
      <ThemedText style={[styles.headerText, styles.cellAction]}>Actions</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Modal
        visible={scannerVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}>
          <View style={styles.modalContainer}>
            <BarCodeScanner
              onBarCodeScanned={scannerVisible ? handleBarCodeScanned : undefined}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.cancelButtonContainer}>
              <Button title="Cancel" onPress={() => setScannerVisible(false)} color="#fff" />
            </View>
          </View>
      </Modal>

      <View style={styles.titleRow}>
        <ThemedText type="title" style={styles.title}>My Paints</ThemedText>
        <Pressable onPress={handleAddPress} style={styles.addButton}>
            <IconSymbol name="plus.circle" size={32} color="#007AFF" />
        </Pressable>
      </View>
      
      {statusMessage && (
        <ThemedView style={[styles.statusBox, statusMessage.type === 'error' ? styles.errorBox : styles.successBox]}>
            <ThemedText>{statusMessage.message}</ThemedText>
        </ThemedView>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={paints}
          renderItem={renderPaintItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          style={styles.table}
          ListEmptyComponent={<ThemedText style={styles.emptyText}>Your paint library is empty!</ThemedText>}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { flex: 1, textAlign: 'center', marginLeft: 48 },
  addButton: { padding: 8 },
  modalContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'black' },
  cancelButtonContainer: { marginBottom: 40 },
  table: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  row: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  headerRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, backgroundColor: '#f0f0f0', borderTopLeftRadius: 8, borderTopRightRadius: 8, alignItems: 'center' },
  headerText: { fontWeight: 'bold' },
  cellImage: { flex: 0.7, alignItems: 'center' },
  cellName: { flex: 2, paddingLeft: 8 },
  cellBrand: { flex: 1.5 },
  cellQty: { flex: 0.5, textAlign: 'center' },
  cellAction: { flex: 0.8, alignItems: 'center' },
  paintImage: { width: 40, height: 40, borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  statusBox: { padding: 12, borderRadius: 8, marginBottom: 16 },
  errorBox: { backgroundColor: '#f8d7da' },
  successBox: { backgroundColor: '#d4edda' },
});
