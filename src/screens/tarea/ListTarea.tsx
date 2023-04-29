import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, TouchableHighlight, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph, Menu, Button, Divider } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService, postService } from '../../utils/HttpService';
import { IDataTarea, TipoTareaEnum } from '../../utils/interfaces/ITarea';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { formatDateTime } from '../../utils/GeneralUtils';
import { EstadoTareaEnum, EstadoTareaKeyEnum } from '../../utils/enums/IGeneral';

interface ITareaListProps {
    tipo: string,
    navDetalle:(tarea: IDataTarea)=>void,
    title:string,
}
export const ListTarea: React.FC<ITareaListProps> = ({ tipo,navDetalle,title }: ITareaListProps) => {
    const [paginaActual, setPaginaActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDatalist] = useState([]);
    const [paginaTotal, setPaginaTotal] = useState(0);
    
    useEffect(() => {
        getList(paginaActual);
    }, []);

    useEffect(() => {
    }, [dataList]);    

    const onRefresh = useCallback(() => {
        getList(paginaActual)
    }, []);

    const getList = async (page: number) => {
        setLoading(true);
        getService(`/tarea/listEstado/${tipo}/${page}/10`)
            .then(res => {
                setLoading(false)
                setRefreshing(false);
                setDatalist([]);
                if (res.success) {
                    setPaginaActual(0);
                    setPaginaTotal(res.total || 0);
                    setDatalist(res.data);
                }
            }).catch(error => {
                throw new Error(error);
            })
            .finally(() => {
                setRefreshing(false);
                setLoading(false)
            })
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
            <Card key={"head-card"}>
                <Card.Title key={"head-card-title"}
                    title={title}
                    titleStyle={{ textAlign: 'center' }}
                    
                    right={(props) => <IconButton size={30} icon="refresh" color={Color.white} key={"head-card-title-icon"}
                        style={{ backgroundColor: Color.secondary }} onPress={onRefresh} />}
                />
            </Card>
            {loading && <ActivityIndicator animating={loading} key={"tarea-indicator"} />}

            {dataList && dataList.map((tarea: IDataTarea, index: number) => (
                <View key={"tarea-view" + index}>
                    <Card key={"tarea-card-key-" + index}>
                        <TouchableHighlight onPress={() => { navDetalle(tarea) }} underlayColor="white" key={"tarea-card-touch-" + index}>
                            <Card.Title key={"tarea-card-title-key-" + index}
                                title={Object.values(TipoTareaEnum)[Object.keys(TipoTareaEnum).indexOf(tarea.tipo)]}
                                subtitle={"Cliente: " + tarea.cliente.nombre}
                                titleStyle={{ fontSize: 16 }}
                                subtitleStyle={{ fontWeight: 'bold' }}
                                left={(props) => <IconButton size={30} icon="clipboard-arrow-right" color={Color.white}
                                    key={"tarea-card-title-icon-key-" + index} style={{ backgroundColor: Color.secondary }} />}
                                right={(props) => <IconButton {...props} icon="clipboard-arrow-right" color={Color.secondary} />}

                            />
                        </TouchableHighlight>
                        <Card.Content key={"tcard-key-" + index}>
                            <DataTable.Row key={"tcard-row-dir-key-" + index}>
                                <DataTable.Cell key={"tcard-row-cell-dir-key-" + index}>Dirección</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-cell-dir-val-" + index}>{tarea?.cliente.direccion}</DataTable.Cell>
                            </DataTable.Row >
                            <DataTable.Row key={"tcard-row-fecha-key-" + index}>
                                <DataTable.Cell key={"tcard-row-fecha-key-" + index}>Fecha</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-fecha-val-" + index}>{formatDateTime(tarea.fecha)}</DataTable.Cell>
                            </DataTable.Row>
                            {tarea.motivo && tarea.motivo !== "" &&
                                <DataTable.Row key={"tcard-row-note-key-" + index}>
                                    <DataTable.Cell key={"tcard-row-note-key-" + index}>Notas</DataTable.Cell>
                                    <DataTable.Cell key={"tcard-row-note-val-" + index}>{(tarea.motivo)}</DataTable.Cell>
                                </DataTable.Row>}
                            {tarea.referencia && tarea.referencia !== "" &&
                                <DataTable.Row key={"tcard-row-ref-key-" + index}>
                                    <DataTable.Cell key={"tcard-row-ref-key-" + index}>Referencia</DataTable.Cell>
                                    <DataTable.Cell key={"tcard-row-ref-val-" + index}>{(tarea.referencia)}</DataTable.Cell>
                                </DataTable.Row>}
                        </Card.Content>
                    </Card>
                    <Divider key={"tarea-divider-key-" + index} />
                </View>
            ))}
            <View key={"tarea-view" }>
                    <Card key={"tarea-card-key-" }>
                        <TouchableHighlight onPress={() => { navDetalle({id: "1",
  tipo: 'P', codCliente: 'string', responsable: 'Javier Canqui', fecha: new Date().toLocaleDateString(),
  recordatorio: 5,
  motivo: "compra",
  referencia: "S/R",
  estado: "P",
  fechaRegistro: new Date().toLocaleDateString(),  
  usuarioRegistro: "xavier",
  sucursalRegistro:2,
  ubicacion:"La Paz",
  cliente:{id: "string",
    nombre: "Leche",
    telefono1: "",
    telefono2: "",
    direccion: "direccion test",
    ci: "821345",
    complemento: "",
    extension: "LP",
    comentario: "",
    estado: "P",
    fechaRegistro: new Date().toLocaleDateString(),
    usuarioRegistro: "xavier",
    sucursalRegistro:0,
    latitud:-16.1232,
    longitud:-68.521}}) }} underlayColor="white" key={"tarea-card-touch-" }>
                            <Card.Title key={"tarea-card-title-key-" }
                                title={Object.values(TipoTareaEnum)[Object.keys(TipoTareaEnum).indexOf("P")]}
                                subtitle={"Producto: Leche" }
                                titleStyle={{ fontSize: 16 }}
                                subtitleStyle={{ fontWeight: 'bold' }}
                                left={(props) => <IconButton size={30} icon="clipboard-arrow-right" color={Color.white}
                                    key={"tarea-card-title-icon-key-" } style={{ backgroundColor: Color.secondary }} />}
                                right={(props) => <IconButton {...props} icon="clipboard-arrow-right" color={Color.secondary} />}

                            />
                        </TouchableHighlight>
                        <Card.Content key={"tcard-key-" }>
                            <DataTable.Row key={"tcard-row-dir-key-" }>
                                <DataTable.Cell key={"tcard-row-cell-dir-key-" }>Monto:</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-cell-dir-val-" }>{"10.00 Bs"}</DataTable.Cell>
                            </DataTable.Row >
                            <DataTable.Row key={"tcard-row-fecha-key-" }>
                                <DataTable.Cell key={"tcard-row-fecha-key-" }>Fecha</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-fecha-val-" }>{"28/04/2023 14:50"}</DataTable.Cell>
                            </DataTable.Row>
                            
                            <DataTable.Row key={"tcard-row-note-key-" }>
                                <DataTable.Cell key={"tcard-row-note-key-" }>Obs</DataTable.Cell>
                                <DataTable.Cell key={"tcard-row-note-val-" }>{"Sin Observaciones"}</DataTable.Cell>
                            </DataTable.Row>
                            
                        </Card.Content>
                    </Card>
                    <Divider key={"tarea-divider-key-" } />
                </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 15,
        textAlign: 'center',
        alignItems: 'center',
        margin: 8,
        fontWeight: 'bold',
    },
    body: {
        color: "#F4F4F4",
        backgroundColor: "#F4F4F4",
        borderRadius: 5,
        margin: 2
    },
    avatarIcon: {
        backgroundColor: Color.secondaryVariant,
    },
})