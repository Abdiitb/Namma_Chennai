// import React from "react";
// import { View } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// export default function DiscoverScreen() {
//   // Chennai coordinates
//   const initialRegion = {
//     latitude: 13.0827,
//     longitude: 80.2707,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   };

//   // Sample POIs in Chennai
//   const markers = [
//     {
//       id: 1,
//       title: "Victoria Palace",
//       latitude: 13.0603,
//       longitude: 80.2809,
//     },
//     {
//       id: 2,
//       title: "Rippon Building",
//       latitude: 13.0523,
//       longitude: 80.2756,
//     },
//     {
//       id: 3,
//       title: "Egmore Community Cleaning",
//       latitude: 13.0626,
//       longitude: 80.2619,
//     },
//   ];

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={initialRegion}
//         provider="google"
//       >
//         {markers.map((marker) => (
//           <Marker
//             key={marker.id}
//             coordinate={{
//               latitude: marker.latitude,
//               longitude: marker.longitude,
//             }}
//             title={marker.title}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// }