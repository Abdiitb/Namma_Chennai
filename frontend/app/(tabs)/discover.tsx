import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function DiscoverScreen() {
  const places = [
    { icon: 'location-outline', name: 'Heritage Sites', color: '#8B5CF6' },
    { icon: 'calendar-outline', name: 'Events', color: '#F59E0B' },
    { icon: 'restaurant-outline', name: 'Restaurants', color: '#EC4899' },
    { icon: 'footsteps-outline', name: 'Parks', color: '#10B981' },
    { icon: 'musical-notes-outline', name: 'Cultural Centers', color: '#06B6D4' },
    { icon: 'car-sport-outline', name: 'Tourist Spots', color: '#EF4444' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Discover</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="map" size={48} color="#016ACD" />
          <ThemedText style={styles.infoTitle}>Explore Chennai</ThemedText>
          <ThemedText style={styles.infoSubtitle}>
            Discover places, events, and attractions in your city
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
          <View style={styles.categoriesGrid}>
            {places.map((place, index) => (
              <View key={index} style={styles.categoryCard}>
                <View style={[styles.categoryIconContainer, { backgroundColor: `${place.color}20` }]}>
                  <Ionicons name={place.icon as any} size={28} color={place.color} />
                </View>
                <ThemedText style={styles.categoryName}>{place.name}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <ThemedText style={styles.noteText}>
            This is a temporary discover screen. Map and location features will be available soon.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  noteCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});


// else {
  
//   const React = require("react");
//   const { View } = require("react-native");
  
//     DiscoverScreen = function () {
//     const MapView = require("react-native-maps").default;
//     const { Marker } = require("react-native-maps");
//     // Chennai coordinates
//     const initialRegion = {
//       latitude: 13.0827,
//       longitude: 80.2707,
//       latitudeDelta: 0.05,
//       longitudeDelta: 0.05,
//     };

//     // Sample POIs in Chennai
//     const markers = [
//       {
//         id: 1,
//         title: "Victoria Palace",
//         latitude: 13.0603,
//         longitude: 80.2809,
//       },
//       {
//         id: 2,
//         title: "Rippon Building",
//         latitude: 13.0523,
//         longitude: 80.2756,
//       },
//       {
//         id: 3,
//         title: "Egmore Community Cleaning",
//         latitude: 13.0626,
//         longitude: 80.2619,
//       },
//     ];

//     return (
//       <View style={{ flex: 1 }}>
//         <MapView
//           style={{ flex: 1 }}
//           initialRegion={initialRegion}
//           provider="google"
//         >
//           {markers.map((marker) => (
//             <Marker
//               key={marker.id}
//               coordinate={{
//                 latitude: marker.latitude,
//                 longitude: marker.longitude,
//               }}
//               title={marker.title}
//             />
//           ))}
//         </MapView>
//       </View>
//     );
//   };
// }

// export default DiscoverScreen;


