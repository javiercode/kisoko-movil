import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Alert, Dimensions, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { ActivityIndicator, Avatar, Button, Card, Dialog, IconButton, Paragraph, ProgressBar } from 'react-native-paper';
import { IDataTarea, IGaleria, IMovimiento } from '../../utils/interfaces/ITarea';
import { getPosition, getPositionService } from '../../utils/MapUtils';
import Color from '../../utils/styles/Color';
import { Carrousel } from '../../components/Carrousel';
import { Permission } from '../../components/Permission';

import ReactNativeBlobUtil from 'react-native-blob-util'
import { formDataService, getService } from '../../utils/HttpService';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum } from '../../utils/enums/IGeneral';
import { getMovimientos,addMovimiento } from '../../store/movimiento';
import { IGaleriaReducer } from '../../utils/interfaces/IMovimientoStore';

interface IPhotoProps {
    tarea: IDataTarea
}
export const Photo: React.FC<IPhotoProps> = ({ tarea }: IPhotoProps) => {
    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>(null);
    const [permission, sertPermission] = useState<boolean>(false);
    const [galeriaList, setGaleriaList] = useState<IGaleria[]>([]);
    const [galeriaListNube, setGaleriaListNube] = useState<IGaleria[]>([]);
    const [progress, setProgress] = useState<number>(0);
    const [confirmUpload, setConfirmUpload] = useState<boolean>(false);

    useEffect(() => {
        
    }, [galeriaList, permission, photo, progress, galeriaListNube]);
    
    useEffect(() => {
        loadFotosNube();
    }, []);
    
    
    useEffect(() => {
        const galeriaListTemp:IGaleria[] = getMovimientos(tarea.id);
        if(galeriaListTemp){
            console.log("galeriaList prev",galeriaList) 
            console.log("galeriaListTemp",galeriaListTemp) 
            setGaleriaList(prevGaleriaList => galeriaListTemp);
            console.log("galeriaList post",galeriaList) 
        }
        // setGaleriaList(prevGaleriaList => [
        //     {
        //       "fecha": "30/09/2022 21:51:54",
        //       "fileName": "rn_image_picker_lib_temp_74b7d3b1-dfaa-4ecd-9eaf-b2044baf7b42.jpg",
        //       "path": "file:///data/user/0/com.micliente/cache/rn_image_picker_lib_temp_74b7d3b1-dfaa-4ecd-9eaf-b2044baf7b42.jpg",
        //       "type": "image/jpeg",
        //       "ubicacion": {
        //         "accuracy": 22.746999740600586,
        //         "altitude": 4072,
        //         "heading": 0,
        //         "lat": -16.5285587,
        //         "lng": -68.1820527,
        //         "speed": 0,
        //         "success": true
        //       }
        //     },
        //     {
        //       "fecha": "30/09/2022 21:52:50",
        //       "fileName": "rn_image_picker_lib_temp_77849488-aa34-4df9-a8f1-49cf2f9e51e1.jpg",
        //       "path": "file:///data/user/0/com.micliente/cache/rn_image_picker_lib_temp_77849488-aa34-4df9-a8f1-49cf2f9e51e1.jpg",
        //       "type": "image/jpeg",
        //       "ubicacion": {
        //         "accuracy": 20,
        //         "altitude": 4072,
        //         "heading": 0,
        //         "lat": -16.5285577,
        //         "lng": -68.1820588,
        //         "speed": 0,
        //         "success": true
        //       }
        //     }
        //   ]);
    }, []);


    const loadFotosNube = () => {
        getService(`/movimiento/list/${tarea.id}`)
            .then(res => {
                const movimientoList:IMovimiento[] = res.data || [];
                const aImagen:IGaleria[] = movimientoList.map(movimiento=>{
                    return  {
                        path: Image.resolveAssetSource(require("../../assets/images/cloud-check.jpg")).uri,
                        fileName: movimiento.fileName,
                        type: "local",
                        ubicacion: {
                            lat: movimiento.latitud,
                            lng: movimiento.longitud,
                            success:true},
                        fecha: formatDateTime(movimiento.fecha.toString()),
                    } as IGaleria;
                });
                setGaleriaListNube(prevGaleriaListNube => aImagen);
            });

    }

    const capturePhoto = () => {
        setLoadingPhoto(true)
        ImagePicker.launchCamera({
            saveToPhotos: true,
            mediaType: 'photo',
            // includeBase64: true,
            quality: 0.3,
            maxWidth:800,
            maxHeight:800

        }, setPhoto).then(res => {
            if (res.assets && res.assets.length > 0) {
                const path = res.assets[0].uri;
                const filename = res.assets[0].fileName || "";
                const type = res.assets[0].type || "";
                // const blob = res.assets[0].base64 || "";
                getPosition().then((position) => {
                    const galeria = {
                        path: path,
                        fileName: filename,
                        type: type,
                        ubicacion: position,
                        fecha: formatDateTime(new Date().toString()),
                        // blob:blob
                    } as IGaleria;
                    setGaleriaList(prevGaleriaList => [...galeriaList, galeria]);

                    addMovimiento(tarea.id, galeria)
                    console.log("galeria store", getMovimientos(tarea.id))
                })
            }
        }).finally(() => {
            setLoadingPhoto(false);
        });
    }

    const updateGaleria = (path: string) => {
        const tempGaleriaList = galeriaList.filter(o => o.path !== path);
        setGaleriaList(galeria => tempGaleriaList);
    }


    const hasPermission = (permiso: boolean) => {
        sertPermission(permiso)
    }

    const uploadFiles = async () => {
        setConfirmUpload(false)
        const imageList = galeriaList.map(function (x: IGaleria) {
            return { name: 'image', filename: x.fileName, type: x.type, data: ReactNativeBlobUtil.wrap(x.path) };
        });
        const metadataList = galeriaList.map(function (x: IGaleria) {
            return {
                name: 'metadata', data: JSON.stringify({
                    latitud: x.ubicacion.lat,
                    longitud: x.ubicacion.lng,
                    fecha: x.fecha,
                    filename: x.fileName,
                    idTarea: tarea.id,
                })
            };
        });
        const formData = metadataList.concat(imageList);
        const response = await formDataService("/movimiento/upload", formData, setProgress);
        if(response.success){
            setGaleriaListNube(prevGaleriaList => galeriaListNube.concat(galeriaList));
            setGaleriaList(prevGaleriaList => []);
        }
        setProgress(1);
    }

    return (
        <ScrollView>
            <Permission camera={true} location={true} read={true} write={false} bakground={false} setPermission={hasPermission} />
            {progress !== 0 && progress !== 1 &&
                <ProgressBar progress={progress} color={Color.secondary} />
            }
            <ActivityIndicator animating={loadingPhoto} color={Color.secondaryVariant} />
            {permission &&
                <SafeAreaView>
                    <View style={styles.containerFlex}>
                        <IconButton
                            icon="camera"
                            size={40}
                            onPress={() => capturePhoto()}
                            style={styles.iconButton}
                            color={Color.white}
                            disabled={loadingPhoto || tarea.estado=== EstadoTareaEnum.FINALIZADO}
                        />
                        <IconButton
                            icon="cloud-upload"
                            disabled={galeriaList.length==0}
                            color={Color.white}
                            size={40}
                            onPress={() => setConfirmUpload(true)}
                            style={styles.iconButton}
                        />

                    </View>

                    {galeriaList.length !== 0 &&
                        <View>
                            <Card.Title
                                title="Tomadas"
                                left={(props) => <Avatar.Icon {...props} icon="camera" style={{ backgroundColor: Color.primary }} />}
                            />
                            <Carrousel imgList={galeriaList} updateGallery={updateGaleria} dropImage={true} />
                        </View>
                    }

                    {galeriaListNube.length !== 0 &&
                        <View>
                            <Card.Title
                                title="Subidas"
                                left={(props) => <Avatar.Icon {...props} icon="camera" style={{ backgroundColor: Color.primary }} />}
                            />
                            <Carrousel imgList={galeriaListNube} updateGallery={() => { }} dropImage={false} />
                        </View>}



                </SafeAreaView>
            }

            <Dialog visible={confirmUpload} onDismiss={() => setConfirmUpload(false)}>
                <Dialog.Content>
                    <Paragraph>¿Esta seguro de subir {galeriaList.length} foto(s)</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setConfirmUpload(false)}>Cancelar</Button>
                    <Button onPress={uploadFiles}>Ok</Button>
                </Dialog.Actions>
            </Dialog>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    containerFlex: {
        flexDirection: "row",
        justifyContent: 'center',
        margin: 2,
        width: '95%',
        paddingLeft: '4%'
    },
    iconButton: {
        backgroundColor: Color.secondaryVariant,
        flex: 5
    }
});