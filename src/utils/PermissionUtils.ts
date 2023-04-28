import { ILocation, IMapConfig } from "./interfaces/IGeneral";
import { Platform, StyleSheet, ToastAndroid, PermissionsAndroid, Dimensions, PermissionsAndroidStatic, Permission } from "react-native"
import Geolocation from 'react-native-geolocation-service';
import { Alert } from "react-native"
const { width, height } = Dimensions.get('window');


export const hasPermission = async (type:Permission):Promise<boolean> => {
  // const typerPermission = PermissionsAndroid[type as keyof PermissionsAndroidStatic];
  // console.log(typerPermission)
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    type,
  );
  

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    type,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  
  let tipoPermiso = getTipoPermiso(type);
  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Permiso de '+tipoPermiso+' denegada por usuario.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Permison de '+tipoPermiso+' revocada por usuario.',
      ToastAndroid.LONG,
    );
  }
  return false;
};

export const getTipoPermiso = (type:Permission):string => {
  let tipoPermiso = ""
  switch(type){
    case PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION:
      tipoPermiso ="ubicación";
      break;
    case PermissionsAndroid.PERMISSIONS.CAMERA:
      tipoPermiso ="camara";
      break;
  }
  return tipoPermiso;
}