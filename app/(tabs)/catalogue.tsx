import React from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define the structure of a single paint object for TypeScript
type Paint = {
  id: string;
  imageUrl: string;
  name: string;
  brand: string;
  colour: string;
};

// Hardcoded dummy data for our paint catalogue prototype.
// In the future, this will come from a database.
const DUMMY_PAINTS: Paint[] = [
  { id: '1', imageUrl: 'https://placehold.co/40x40/ff0000/ffffff?text=P', name: 'Mephiston Red', brand: 'Citadel', colour: 'Red' },
  { id: '2', imageUrl: 'https://placehold.co/40x40/0000ff/ffffff?text=P', name: 'Macragge Blue', brand: 'Citadel', colour: 'Blue' },
  { id: '3', imageUrl: 'https://placehold.co/40x40/00ff00/ffffff?text=P', name: 'Goblin Green', brand: 'The Army Painter', colour: 'Green' },
  { id: '4', imageUrl: 'https://placehold.co/40x40/ffff00/000000?text=P', name: 'Flash Gitz Yellow', brand: 'Citadel', colour: 'Yellow' },
  { id: '5', imageUrl: 'https://placehold.co/40x40/000000/ffffff?text=P', name: 'Matt Black', brand: 'The Army Painter', colour: 'Black' },
  { id: '6', imageUrl: 'https://placehold.co/40x40/ffffff/000000?text=P', name: 'Thamar Black', brand: 'P3', colour: 'Black' },
];

// This is the main component for our new screen.
export default function CatalogueScreen() {
  
  // This component renders a single row in our table.
  const renderPaintItem = ({ item }: { item: Paint }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Image source={{ uri: item.imageUrl }} style={styles.paintImage} />
      </View>
      <ThemedText style={styles.cell}>{item.name}</ThemedText>
      <ThemedText style={styles.cell}>{item.brand}</ThemedText>
      <ThemedText style={styles.cell}>{item.colour}</ThemedText>
    </View>
  );

  // This component renders the header row of our table.
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <ThemedText style={[styles.headerCell, styles.headerText]}>Paint</ThemedText>
      <ThemedText style={[styles.headerCell, styles.headerText]}>Name</ThemedText>
      <ThemedText style={[styles.headerCell, styles.headerText]}>Brand</ThemedText>
      <ThemedText style={[styles.headerCell, styles.headerText]}>Colour</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>My Paints</ThemedText>
      {/* FlatList is a React Native component optimized for displaying long lists of data.
        - data: The array of data to display.
        - renderItem: A function that tells the list how to render each individual item.
        - keyExtractor: A function that provides a unique key for each item, which helps React optimize rendering.
        - ListHeaderComponent: A component to render at the very top of the list.
      */}
      <FlatList
        data={DUMMY_PAINTS}
        renderItem={renderPaintItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        style={styles.table}
      />
    </ThemedView>
  );
}

// StyleSheet is used to create our style objects, which is more efficient than inline styling.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'left',
  },
  headerCell: {
    flex: 1,
    textAlign: 'left',
  },
  headerText: {
    fontWeight: 'bold',
  },
  paintImage: {
    width: 40,
    height: 40,
    borderRadius: 8, // Rounded corners for the images
  },
});
```

Next, I'll add this new screen to the tab bar at the bottom of the app by modifying the layout file.


```tsx
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      {/* This is the new screen we are adding to the tab bar.
        - name: This must match the filename of our new screen (catalogue.tsx).
        - title: This is the text that will appear under the icon.
        - tabBarIcon: This specifies which icon to display. We're using a 'brush' icon.
      */}
      <Tabs.Screen
        name="catalogue"
        options={{
          title: 'Catalogue',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'brush' : 'brush-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

After these changes are committed and you run the app, you will see a new "Catalogue" tab at the bottom. Tapping it will take you to the "My Paints" screen showing the table of dummy da