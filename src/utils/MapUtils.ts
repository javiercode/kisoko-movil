import { ILocation, IMapConfig } from "./interfaces/IGeneral";
import { Platform, StyleSheet, ToastAndroid, PermissionsAndroid, Dimensions } from "react-native"
import Geolocation from 'react-native-geolocation-service';
import { Alert } from "react-native"
const { width, height } = Dimensions.get('window');

// export const getInitMap = async (position: ILocation): Promise<IMapConfig> => {
export const getInitMap = async (): Promise<IMapConfig> => {
  
  const position = await getPosition();
  const LATITUDE = position.lat;
  const LONGITUDE = position.lng;

  const LATITUDE_DELTA = 0.0922;
  const ASPECT_RATIO = width / height;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  // getPosition()
  const mapInit = {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  } as IMapConfig;
  return mapInit;
}

export const hasLocationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

export const getPosition = async(): Promise<ILocation> => {
  let location: ILocation = { lat: 0, lng: 0, success: false };
  try {
    const position = await getPositionService();
    if (position != null) {
      location.lat = position.coords.latitude;
      location.lng = position.coords.longitude;
      location.altitude = position.coords.altitude;
      location.accuracy = position.coords.accuracy;
      location.heading = position.coords.heading;
      location.speed = position.coords.speed;
      location.success = true
    }
  } catch (err :any) {
    Alert.alert(`Error posición`, err);
      // setLocation(null);
      console.error("error", err);
  }
  return location;
}

// export const getPositionService = async () => {
//   const hasPermission = await hasLocationPermission();
//   if (!hasPermission) {
//     return;
//   }

//   Geolocation.getCurrentPosition(
//     (position) => {
//       console.log("position", position);
//     },
//     (error) => {
//       Alert.alert(`Code ${error.code}`, error.message);
//       // setLocation(null);
//       console.error("error", error);
//     },
//     {
//       accuracy: {
//         android: 'high',
//         ios: 'best',
//       },
//       // enableHighAccuracy: highAccuracy,
//       timeout: 15000,
//       maximumAge: 10000,
//       distanceFilter: 0,
//       // forceRequestLocation: forceLocation,
//       // forceLocationManager: useLocationManager,
//       // showLocationDialog: locationDialog,
//     },
//   );
//   // return location;
// }


export function getPositionService(): Promise<any> {
  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject,
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
      })
  );
}
