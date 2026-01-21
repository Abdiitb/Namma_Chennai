


import { Platform } from "react-native";

let DiscoverScreen: any;

if (Platform.OS === "web") {
   DiscoverScreen = require("./discover.web").default;
} 
else {
     DiscoverScreen = require("./discover.native").default;

}
export default DiscoverScreen;


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


