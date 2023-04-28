import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { getService } from '../utils/HttpService';
import { IDataCliente } from '../utils/interfaces/ICliente';
import Color from '../utils/styles/Color';

const { width: PAGE_WIDTH } = Dimensions.get('window');

interface ISearchClienteProps {
    updateCliente:(cliente:string)=>void
}

export const SearchCliente: React.FC<ISearchClienteProps> = ({ updateCliente }: ISearchClienteProps) => {    
    const [searchCliente, setSearchClliente] = useState("");
    const [dataList, setDataList] = useState<IDataCliente[]>([]);
    const [textButton, setTextButton] = useState("0 resultados");

    const getList = async (search: string) => {
        setTextButton("Buscando...");
        getService(`/cliente/findCI/${search}`)
            .then(res => {
                setTextButton("Ningún resultado!");
                setDataList([]);
                if (res.success) {
                    setDataList(res.data);
                    setTextButton((res.data?.length || 0)+" registro(s)" )
                }
            }).catch(error => {
                throw new Error(error);
                setTextButton("Error al buscar el dato")
            })
    }

    const onChangeSearch = (text: string) => {
        setSearchClliente(text);
        getList(text)
    }

    const onSelectedCliente = (cliente: IDataCliente) => {
        updateCliente(cliente.id)
    }

    return (
        <View style={styles.containerFlex}>
            <TextInput
                label="Buscar Cliente"
                placeholder='CI o Nombre'
                value={searchCliente}
                mode="outlined"
                style={{ flex: 4 }}
                onChangeText={onChangeSearch}
                left={<TextInput.Icon name="account-search" />}
            />
            <SelectDropdown
                dropdownIconPosition='right'
                data={dataList}
                onSelect={(selectedItem, index) => {
                    onSelectedCliente(selectedItem)
                }}

                buttonTextAfterSelection={(selectedItem, index) => {
                    return  selectedItem.nombre
                }}
                rowTextForSelection={(item, index) => {
                    const ci = item.ci + (item.complemento !== "" ? " - " + item.complemento : "") + " " + item.extension;
                    return item.nombre+" - "+ci
                }}
                defaultButtonText={textButton}
                buttonStyle={styles.dropdownBtnStyle}
                renderDropdownIcon={isOpened => {
                    return <TextInput.Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                }}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    containerFlex: {
        // flexDirection: "row",
        justifyContent: 'center',
        margin: 2,
        width: '100%',
    },
    dropdownBtnStyle: {
        flex: 6,
        height: 40,
        width: '100%',
        backgroundColor: Color.white,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 0,
        borderColor: '#444',
    }
});