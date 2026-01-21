// import React from "react";
// import { View, StyleSheet, TextInput, ScrollView, Text, Image, TouchableOpacity, Dimensions } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// const { width } = Dimensions.get("window");

// export default function DiscoverScreen() {
//   const initialRegion = {
//     latitude: 13.0827,
//     longitude: 80.2707,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   };

//   const markers = [
//     { id: 1, title: "Cleaning Event", latitude: 13.0850, longitude: 80.2550, image: 'https://cdn-icons-png.flaticon.com/512/3062/3062545.png', type: 'Live' },
//     { id: 2, title: "MA Chidambaram Stadium", latitude: 13.0628, longitude: 80.2830, image: 'https://cdn-icons-png.flaticon.com/512/2910/2910793.png' },
//     { id: 3, title: "Valluvar Kottam", latitude: 13.0500, longitude: 80.2410, image: 'https://cdn-icons-png.flaticon.com/512/1000/1000951.png' },
//     { id: 4, title: "Rippon Building", latitude: 13.0300, longitude: 80.2700, image: 'https://cdn-icons-png.flaticon.com/512/285/285800.png' },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* 1. The Map */}
//       <MapView
//         style={styles.map}
//         initialRegion={initialRegion}
//         provider={PROVIDER_GOOGLE}
//         showsUserLocation={true}
//       >
//         {markers.map((marker) => (
//           <Marker
//             key={marker.id}
//             coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
//           >
//             <View style={styles.customMarker}>
//               {marker.type === 'Live' && (
//                  <View style={styles.liveBadge}><Text style={styles.liveText}>• Live</Text></View>
//               )}
//               <Image source={{ uri: marker.image }} style={styles.markerImage} />
//               <Text style={styles.markerTitle}>{marker.title}</Text>
//             </View>
//           </Marker>
//         ))}
//       </MapView>

//       {/* 2. Top UI Overlay */}
//       <View style={styles.topOverlay}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
//           <TextInput placeholder="Search location" style={styles.searchInput} />
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
//           <CategoryItem icon="museum" label="Heritage" />
//           <CategoryItem icon="event" label="Events" />
//           <CategoryItem icon="pool" label="Pools" />
//           <CategoryItem icon="sports-soccer" label="Sports" />
//         </ScrollView>
//       </View>

      
//     </View>
//   );
// }

// // Sub-components for cleaner code
// const CategoryItem = ({ icon, label }) => (
//   <TouchableOpacity style={styles.categoryItem}>
//     <MaterialCommunityIcons name={icon} size={18} color="black" />
//     <Text style={styles.categoryLabel}>{label}</Text>
//   </TouchableOpacity>
// );



// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { ...StyleSheet.absoluteFillObject },
//   topOverlay: { position: 'absolute', top: 50, width: '100%', alignItems: 'center' },
//   searchContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     width: width * 0.9,
//     padding: 12,
//     borderRadius: 25,
//     elevation: 5,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   searchInput: { flex: 1, fontSize: 16 },
//   categoryScroll: { paddingLeft: 20 },
//   categoryItem: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 10,
//     alignItems: 'center',
//     elevation: 2,
//   },
//   categoryLabel: { marginLeft: 5, fontWeight: '500' },
//   customMarker: { alignItems: 'center', width: 100 },
//   markerImage: { width: 50, height: 50, borderRadius: 25, resizeMode: 'contain' },
//   markerTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },
//   liveBadge: { backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 5, marginBottom: 2 },
//   liveText: { color: 'green', fontSize: 10, fontWeight: 'bold' },
//   bottomNav: {
//     position: 'absolute',
//     bottom: 30,
//     flexDirection: 'row',
//     backgroundColor: '#F0F4F8',
//     width: width * 0.9,
//     alignSelf: 'center',
//     borderRadius: 40,
//     padding: 8,
//     justifyContent: 'space-between',
//     elevation: 10,
//   },
//   navItem: { alignItems: 'center', flex: 1, paddingVertical: 8 },
//   activeNavItem: { backgroundColor: '#1A1A1A', borderRadius: 30 },
//   navLabel: { fontSize: 10, marginTop: 4 }
// });