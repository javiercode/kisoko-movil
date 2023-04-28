import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, Dimensions, PermissionsAndroid, Platform, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { FAB, Portal, Provider, Text, Title, DataTable } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService, putService } from '../../utils/HttpService';
import { IDataCliente } from '../../utils/interfaces/ICliente';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import MapView, { Marker } from 'react-native-maps';
import { IDataTarea, TipoTareaEnum } from '../../utils/interfaces/ITarea';

import * as ImagePicker from 'react-native-image-picker';
import { Photo } from './Photo';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum, EstadoTareaKeyEnum } from '../../utils/enums/IGeneral';

const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE_DETAIL>;
export default function TareaDetalle({ route, navigation }: Props) {
    const [tarea, setTarea] = useState<IDataTarea>(route.params?.tarea)
    const [estado, setEstado] = useState<string>(route.params?.tarea.estado)
    //FAB
    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }: { open: boolean }) => setState({ open });
    const { open } = state;
    //--FAB
    useEffect(() => {
        console.log("tarea", tarea.estado)
        console.log("tarea route", route.params?.tarea.estado)

    }, []);

    const navEdit = () => {
        navigation.navigate(MenuPathEnum.TAREA_EDIT, { tarea: tarea })
    };

    const actualizarTarea = (estado: string) => {
        try {
            const url = estado === EstadoTareaEnum.PROCESO ? "/tarea/atender/" : "/tarea/finalizar/";
            putService(url + tarea.id, {}).then((result) => {
                if (result.success) {
                    console.log("actualizar tarea", result.data)
                    const tareaRestult = tarea;
                    tareaRestult.estado = result.data.estado;
                    setEstado(prevEstado=>result.data.estado);
                    setTarea(tarea=>tareaRestult);
                    // navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tareaRestult })
                }
            }).catch(e => {
                console.error(e.code, e.message)
            });
        } catch (error) {
            console.error(error)
        }
    };

    const optionsFab = () => {
        let optionFab = estado == EstadoTareaEnum.FINALIZADO? [
            {
                icon: 'application-edit',
                label: 'Editar',
                onPress: () => navEdit(),
            },
        ]:
        [
            {
                icon: 'application-edit',
                label: 'Editar',
                onPress: () => navEdit(),
            },
            {
                icon: 'file-check',
                label: `${estado == EstadoTareaEnum.ACTIVO ? 'Atender' : 'Finalizar'}`,
                style:{},
                onPress: () => actualizarTarea(estado == EstadoTareaEnum.ACTIVO ? EstadoTareaEnum.PROCESO : EstadoTareaEnum.FINALIZADO),
            },
        ]
        return optionFab;
    };

    return (
        <>
            <ScrollView >
                <View style={styles.container} >
                    <Title style={styles.title}>Información</Title>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Cliente</Text></DataTable.Cell>
                        <DataTable.Cell>{tarea?.cliente.nombre}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Tipo</Text></DataTable.Cell>
                        <DataTable.Cell>{Object.values(TipoTareaEnum)[Object.keys(TipoTareaEnum).indexOf(tarea?.tipo || "")]}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Estado</Text></DataTable.Cell>
                        <DataTable.Cell>{Object.values(EstadoTareaKeyEnum)[Object.keys(EstadoTareaKeyEnum).indexOf(estado || "")]}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Dirección</Text></DataTable.Cell>
                        <DataTable.Cell>{tarea?.cliente.direccion}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Fecha</Text></DataTable.Cell>
                        <DataTable.Cell>{`${formatDateTime(tarea?.fecha)} - ~\n ${tarea?.recordatorio} min antes`}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Motivo</Text></DataTable.Cell>
                        <DataTable.Cell>{tarea?.motivo}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Referencia</Text></DataTable.Cell>
                        <DataTable.Cell>{tarea?.referencia}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Creado</Text></DataTable.Cell>
                        <DataTable.Cell>{formatDateTime(tarea?.fechaRegistro)}</DataTable.Cell>
                    </DataTable.Row>
                    {tarea?.fechaModificacion && tarea?.fechaModificacion !== "" &&
                        <DataTable.Row>
                            <DataTable.Cell style={{justifyContent:'center'}}><Text style={styles.textLeft}>Modificado</Text></DataTable.Cell>
                            <DataTable.Cell>{formatDateTime(tarea?.fechaModificacion)}</DataTable.Cell>
                        </DataTable.Row>}
                    {(estado=== EstadoTareaEnum.PROCESO || estado=== EstadoTareaEnum.FINALIZADO)  &&
                        <View>
                            <Photo tarea={route.params?.tarea} />
                        </View>}
                </View>
            </ScrollView>
            <Provider>
                <Portal>
                    <FAB.Group
                        visible
                        open={open}
                        icon={open ? 'calendar-today' : 'plus'}
                        fabStyle={{ backgroundColor: Color.secondary }}

                        actions={optionsFab()}
                        onStateChange={onStateChange}
                        onPress={() => {
                        }}
                    />
                </Portal>
            </Provider>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 10,
        margin: 5,
        // alignItems: 'stretch',
    },
    textLeft: {
        margin: 10,
        color: Color.black,
        fontWeight:'bold'
    },
    textRight: {
        margin: 10,
        color: Color.black
    },
    button: {
        backgroundColor: '#fff',
        textShadowColor: 'blue',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 40,
        borderRadius: 5,
        margin: 10,
    },
    labelStyle: {
        color: "black",
        fontSize: 18
    },
    container: {
        backgroundColor: Color.white,
        color:Color.black,
        paddingBottom:10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        marginLeft: 46,
        marginTop: 33,
        fontWeight: 'bold',
    },
})