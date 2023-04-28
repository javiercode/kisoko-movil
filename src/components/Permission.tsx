import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Alert, Image, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Banner, Button, ToggleButton } from 'react-native-paper';
import { hasPermission } from '../utils/PermissionUtils';

interface IPermissionProps {
    camera: boolean;
    location: boolean;
    read: boolean;
    write: boolean;
    bakground: boolean;
    // permission: (estado: boolean) => boolean
    setPermission: (estado: boolean) => void
}
interface IToggleButton {
    status: 'checked' | 'unchecked' | undefined;
}

export const Permission: React.FC<IPermissionProps> = ({ camera, location, read, setPermission }: IPermissionProps) => {

    const permissionCamera = useRef<boolean>(false);
    const permissionLocation = useRef<boolean>(false);
    const permissionRead = useRef<boolean>(false);
    const [perLocation, setPerLocation] = useState<boolean>(false);
    const [perCamera, setPerCamera] = useState<boolean>(false);
    const [perRead, setPerRead] = useState<boolean>(false);

    useEffect(() => {
            
                if (camera) { checkPermisoCamera() }
                if (location) { checkPermisoUbicacion() }
                if (read) { checkPermisoRead() }

    }, [perLocation,perCamera,perRead]);

    const checkPermisoCamera = () => {
        const permission = hasPermission(PermissionsAndroid.PERMISSIONS.CAMERA).then(res => {
            permissionCamera.current = (res);
            setPerCamera(res);
            checkPermissions();
        })
    }

    const checkPermisoUbicacion = () => {
        const permission = hasPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(res => {
            permissionLocation.current = (res);
            setPerLocation(res);
            checkPermissions();
        })
    }

    const checkPermisoRead = () => {
        const permission = hasPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(res => {
            permissionRead.current = (res);
            setPerRead(res);
            checkPermissions();
        })
    }

    const checkPermissions = () => {
        const perCamara = (camera ? permissionCamera.current : true)
        const perLocation = (location ? permissionLocation.current : true)
        const perRead = (read ? permissionRead.current : true)
        setPermission(perCamara && perLocation && perRead)
    }


    return (
        <>
            {camera &&
                <Banner
                    key={"banner-permission-camera"}
                    // visible={!permissionCamera.current}
                    visible={!perCamera}
                    // visible={true}
                    actions={[
                        {
                            label: 'Dar Permiso',
                            onPress: () => checkPermisoCamera(),
                        },
                    ]}
                    icon={'camera'}>
                    La aplicación no tiene permisos para acceder a la camara.
                </Banner>
            }
            {location && !permissionLocation.current &&
                <Banner
                    key={"banner-permission-location"}
                    visible={!perLocation}
                    // visible={false}
                    actions={[
                        {
                            label: 'Dar Permiso',
                            onPress: () => checkPermisoUbicacion(),
                        },
                    ]}
                    icon={'map'}>
                    La aplicación no tiene permisos para acceder a la Ubicación.
                </Banner>
            }
            {read && !permissionRead.current &&
                <Banner
                    key={"banner-permission-read"}
                    // visible={!permissionRead.current}
                    visible={!perRead}
                    actions={[
                        {
                            label: 'Dar Permiso',
                            onPress: () => checkPermisoRead(),
                        },
                    ]}
                    icon={'monitor-eye'}>
                    La aplicación no tiene permisos para leer archivos.
                </Banner>
            }

        </>
    )
}
