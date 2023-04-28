import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';
import { Title, Paragraph, TextInput, Button, Text, Switch, Card, IconButton, Searchbar, HelperText, Chip } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getService, postService } from '../../utils/HttpService';
import { IDataTarea, TipoTareaEnum, IDataForm, IFormError, IFormSetError, IFormEditSetError } from '../../utils/interfaces/ITarea';
import SelectDropdown from 'react-native-select-dropdown'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import MapView, { Marker } from 'react-native-maps';
import { IMapConfig } from '../../utils/interfaces/IGeneral';
import { getInitMap } from '../../utils/MapUtils';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatDateTime, getStrFecha } from '../../utils/GeneralUtils';
import { SearchCliente } from '../../components/SearchCliente';
import { getAuth } from '../../store/login';

const initDto: IDataForm = {
    tipo: "",
    codCliente: "",
    responsable: "",
    fecha: "",
    recordatorio: "5",
    motivo: "",
    referencia: "",
};

const regexError: IFormError = {
    tipo: "^[A-Z_]{1,200}$",
    codCliente: "^[a-zA-Z0-9 ]{10,50}$",
    recordatorio: "^[0-9]{1,2}$",
    motivo: "^[a-zA-Z0-9À-ÿ .,-]{0,300}$",
    referencia: "^[a-zA-Z0-9À-ÿ .,-]{0,300}$",
};

type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE_DETAIL>;
const { width, height } = Dimensions.get('window');
export default function TareaCreate({ route, navigation }: Props) {
    const [createDto, setCreateDto] = useState<IDataForm>(initDto);
    const [fecha, setFecha] = React.useState<Date>(new Date());
    const [errorApi, setErrorApi] = React.useState<string>("");

    const [tipoError, setTipoError] = React.useState<string>("");
    const [codClienteError, setCodClienteError] = React.useState<string>("");
    const [fechaError, setFechaError] = React.useState<string>("");
    const [recordatorioError, setRecordatorioError] = React.useState<string>("");
    const [motivoError, setMotivoError] = React.useState<string>("");
    const [referenciaError, setReferenciaError] = React.useState<string>("");
    const [modePicker, setModePicker] = useState<string>('date');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {        
    }, [createDto,tipoError,codClienteError,recordatorioError,motivoError,referenciaError,errorApi]);


    useEffect(() => {
        resetInfo()        
    }, []);

    let tFormError: IFormSetError = {
        tipo: setTipoError,
        codCliente: setCodClienteError,
        recordatorio: setRecordatorioError,
        motivo: setMotivoError,
        referencia: setReferenciaError
    };

    const onChangeInput = (value: string, input: string) => {
        const dto = createDto;
        let regex = new RegExp(regexError[input as keyof IFormError]);
        dto[input as keyof IDataForm] = value;
        
        if (regex.test(value)) {
            // dto[input as keyof IDataForm] = value;
            setCreateDto(dto);
            tFormError[input as keyof IFormSetError]("")
        } else {
            tFormError[input as keyof IFormSetError]("Formato de: " + input + " incorrecto!")
        }
        setErrorApi("")
        return regex.test(value);
    };

    const resetInfo = ()=>{
        setFecha(new Date())
        let resetInfo: IDataForm = {
            tipo: "",
            codCliente: "",
            responsable: "",
            fecha: "",
            recordatorio: "5",
            motivo: "",
            referencia: "",
        };
        setCreateDto( resetInfo);
    }

    const saveUser = () => {
        try {
            let existeError=false;
            Object.keys(tFormError).forEach(key => {
                const x = { text: key, value: createDto[key as keyof IDataForm] }
                const validate = onChangeInput((createDto[key as keyof IDataForm]).toString(), key)
                if(!validate){
                    existeError=true;
                }
            });
            createDto.responsable = getAuth().username || "";
            createDto.fecha = getStrFecha({ date: fecha }) || "";
            if (!existeError && createDto.tipo !== "" && createDto.codCliente !== "" && createDto.responsable !== "" && createDto.fecha) {
                postService("/tarea/create", createDto).then((result) => {
                    setErrorApi(result.success ? "" : result.message);
                    if (result.success) {
                        navigation.goBack();
                    }
                });
                resetInfo()
            } else {
                setErrorApi("Existe un error al llenar el formulario");
            }
        } catch (error) {
            console.error(error)
            setErrorApi("Complete el Formulario, porfavor!");
        }
    };


    const showMode = (currentMode: string) => {
        setShowPicker(true);
        setModePicker(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShowPicker(false);
        setFecha(currentDate);
    };

    const onChangeCodCliente = (text: string) => {
        onChangeInput(text, "codCliente")
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <View style={styles.formControl}>
                    <SelectDropdown
                        dropdownIconPosition='right'
                        data={Object.values(TipoTareaEnum)}
                        onSelect={(selectedItem, index) => {
                            onChangeInput(Object.keys(TipoTareaEnum)[Object.values(TipoTareaEnum).indexOf(selectedItem)], "tipo")
                        }}
                        defaultValue={createDto.tipo}

                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                        defaultButtonText={"Seleccione Tipo"}
                        renderDropdownIcon={isOpened => {
                            return <TextInput.Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                        }}
                    />
                </View>
                <View style={styles.formControl}>
                    <SearchCliente updateCliente={onChangeCodCliente} />
                </View>
                <View style={styles.containerFlex}>
                    <TextInput
                        label="Fecha"
                        value={formatDateTime(fecha.toString())}
                        mode="outlined"
                        disabled
                        style={{ flex: 8 }}
                        left={<TextInput.Icon name="calendar" onPress={showDatepicker} />}
                        right={<TextInput.Icon name="clock" onPress={showTimepicker} />}
                    />

                    {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={fecha}
                            mode={modePicker === 'date' ? 'date' : 'time'}
                            is24Hour={true}
                            onChange={onChangeDate}
                        />
                    )}
                    <TextInput
                        mode="outlined"
                        label="Recordatorio"
                        placeholder="Recordatorio"
                        defaultValue={initDto.recordatorio}
                        style={{ flex: 3 }}
                        onChangeText={text => onChangeInput(text, "recordatorio")}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Motivo"
                        placeholder="Motivo"
                        onChangeText={text => onChangeInput(text, "motivo")}
                    />
                </View>

                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Referencia"
                        placeholder="Referencia"
                        style={{ flex: 5 }}
                        onChangeText={text => onChangeInput(text, "referencia")}
                    />
                </View>

                <View>
                    <Chip icon="alert-circle" onPress={()=>setTipoError("")} style={{ display: tipoError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{tipoError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setCodClienteError("")} style={{ display: codClienteError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{codClienteError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setRecordatorioError("")} style={{ display: recordatorioError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{recordatorioError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setMotivoError("")} style={{ display: motivoError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{motivoError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setReferenciaError("")} style={{ display: referenciaError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{referenciaError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setErrorApi("")} style={{ display: errorApi !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{errorApi }</Chip>
                </View>
                <Button mode="contained" style={styles.button} labelStyle={styles.labelStyle}
                    icon='content-save' onPress={() => saveUser()} >
                    {"Registrar"}
                </Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    formControl: {
        margin: 2,
        width: '95%',
        paddingLeft: '4%'
    },
    title: {
        padding: 10,
        margin: 5,
    },
    text: {
        justifyContent: 'center',
        margin: 10,
    },
    button: {
        backgroundColor: Color.secondary,
        textShadowColor: 'blue',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 40,
        borderRadius: 5,
        margin: 10,
    },
    labelStyle: {
        color: Color.white,
        fontSize: 18
    },
    containerFlex: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        margin: 2,
        width: '95%',
        paddingLeft: '4%'
    },
    container: {
        backgroundColor: Color.white,
        color: Color.white,
    },
    dropdown1BtnStyle: {
        flex: 5,
        width: '100%',
        height: 65,
        backgroundColor: Color.white,
        borderRadius: 8,
        borderWidth: 1,
    },
    dropdown2BtnStyle: {
        width: '100%',
        height: 65,
        backgroundColor: Color.white,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: Color.white
    },
})