import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { DataTable, Text, Searchbar, Avatar, Card, IconButton, Title, Paragraph } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getAuth } from '../../store/login';
import { getService } from '../../utils/HttpService';
import { IDataCliente } from '../../utils/interfaces/ICliente';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';

type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE>;
export default function Cliente({ route, navigation }: Props) {
    const [paginaActual, setPaginaActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDatalist] = useState([]);
    const [paginaTotal, setPaginaTotal] = useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');

    useEffect(() => {
        console.log("index cliente")
        getList(paginaActual);
    }, []);

    const onRefresh = useCallback(() => {
        setLoading(false)
        setRefreshing(true);
        getList(paginaActual);
    }, []);

    const getList = async (page: number) => {
        setLoading(true);
        getService(`/cliente/list/${page}/10`)
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
                setLoading(false)
            })
    }

    const getFind = async (query: string) => {
        setLoading(true);
        getService(`/cliente/findCI/${query}`)
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
                setLoading(false)
            })
    }

    const onChangeSearch = (query: any) => {
        if (query !== "") {
            getFind(query)
        } else {
            getList(paginaActual)
        }
        setSearchQuery(query)
    };

    const navClienteDetalle = (cliente: IDataCliente) => {
        navigation.navigate(MenuPathEnum.CLIENTE_DETAIL, { cliente: cliente })
    };

    return (
        <SafeAreaView>
            <View style={styles.containerFlex}>
                <Searchbar
                    placeholder="Buscar por CI o Nombre"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={{ flex: 5 }}
                />
                <IconButton size={30} icon="refresh" color={Color.white} key={"head-card-title-icon"}
                    style={{ backgroundColor: Color.secondary, flex: 1 }} onPress={onRefresh} />
            </View>
            <ScrollView >
                {dataList.map((cliente: IDataCliente, key: number) => (
                    <Card key={"cliente-card-key-" + key}>
                        <Card.Title key={"cliente-card-title-key-" + key}
                            title={cliente.nombre}
                            subtitle={cliente.ci + (cliente.complemento !== "" ? " - " + cliente.complemento : "") + " " + cliente.extension}
                            left={(props) => <IconButton style={styles.avatarIcon} color={Color.white} size={30} icon="briefcase-account" onPress={() => { navClienteDetalle(cliente) }} />}
                            right={(props) => <IconButton {...props} icon="clipboard-arrow-right" color={Color.secondary} onPress={() => { navClienteDetalle(cliente) }} />}
                        />
                        <Card.Content key={"cliente-card-content-key-" + key}>
                            <Paragraph>{"Dirección: " + cliente.direccion}</Paragraph>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
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
        // backgroundColor: Color.white,
        borderRadius: 5,
        margin: 2
    },
    avatarIcon: {
        backgroundColor: Color.secondary,
    },
    containerFlex: {
        flexDirection: "row",
        justifyContent: 'center',
        margin: 2,
        width: '95%',
        paddingLeft: '4%'
    },
})

const customStyles = ({
    rows: {
        style: {
            minHeight: '72px', // override the row height
        }
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            fontWeight: 'bold',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2
    },
    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        textShadowColor: 'blue',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 60,
        borderRadius: 5,
        margin: 10,
    },
    icono: {
        width: 50,
        height: 42,
        resizeMode: "stretch",
        margin: 10
    },
});