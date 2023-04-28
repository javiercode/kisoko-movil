import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';
import { Title, Paragraph, TextInput, Button, Text, Switch, Card, IconButton, Searchbar, HelperText, Chip } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getService, postService, putService } from '../../utils/HttpService';
import { IDataTarea, TipoTareaEnum, IDataForm, IFormError, IFormSetError, IDataEditForm, IFormEditSetError } from '../../utils/interfaces/ITarea';
import SelectDropdown from 'react-native-select-dropdown'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import MapView, { Marker } from 'react-native-maps';
import { IMapConfig } from '../../utils/interfaces/IGeneral';
import { getInitMap } from '../../utils/MapUtils';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatDateTime, getFecha, getStrFecha } from '../../utils/GeneralUtils';
import { SearchCliente } from '../../components/SearchCliente';
import { getAuth } from '../../store/login';

let initDto: IDataEditForm = {
    tipo: "",
    responsable: "",
    fecha: "",
    recordatorio: "",
    motivo: "",
    referencia: "",
};

let regexError: IFormError = {
    tipo: "^[A-Z_]{1,200}$",
    codCliente: "^[a-zA-Z0-9 ]{10,50}$",
    recordatorio: "^[0-9]{1,10}$",
    motivo: "^[a-zA-Z0-9À-ÿ .,-]{0,300}$",
    referencia: "^[a-zA-Z0-9À-ÿ .,-]{0,300}$",
};

type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE_DETAIL>;
const { width, height } = Dimensions.get('window');
export default function TareaEdit({ route, navigation }: Props) {

    const [tarea, setTarea] = useState<IDataTarea>(route.params?.tarea)
    const [updateDto, setUpdateDto] = useState<IDataEditForm>(initDto);
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

    const [tipo, setTipo] = React.useState<string>();
    const [codCliente, setCodCliente] = React.useState<string>();
    const [cliente, setCliente] = React.useState<string>();
    const [recordatorio, setRecordatorio] = React.useState<number>();
    const [motivo, setMotivo] = React.useState<string>();
    const [referencia, setReferencia] = React.useState<string>();

    useEffect(() => {
        if (route.params?.tarea) {
            setTarea(route.params.tarea);
            setTipo(route.params.tarea.tipo)
            setCodCliente(route.params.tarea.codCliente)
            setRecordatorio(route.params.tarea.recordatorio)
            setMotivo(route.params.tarea.motivo)
            setReferencia(route.params.tarea.referencia)
            setFecha(new Date(route.params.tarea.fecha))
            initDto.tipo= route.params.tarea.tipo;
            initDto.responsable= route.params.tarea.responsable;
            initDto.fecha= route.params.tarea.fecha;
            initDto.recordatorio= route.params.tarea.recordatorio;
            initDto.motivo= route.params.tarea.motivo;
            initDto.referencia= route.params.tarea.referencia;
            setUpdateDto(initDto);
        }
    }, [tarea,tipoError,recordatorioError,motivoError,referenciaError,errorApi]);

    let tFormError: IFormEditSetError = {
        tipo: setTipoError,
        recordatorio: setRecordatorioError,
        motivo: setMotivoError,
        referencia: setReferenciaError
    };
    let tForm: IFormEditSetError = {
        tipo:setTipo,
        recordatorio:setRecordatorio,
        motivo:setMotivo,
        referencia:setReferencia,
      };

    const onChangeInput = (value: string, input: string) => {
        let dto = updateDto;
        let regex = new RegExp(regexError[input as keyof IFormError]);
        if (regex.test(value)) {
            dto[input as keyof IDataEditForm] = value;
            setUpdateDto(dto);
            tFormError[input as keyof IFormEditSetError]("")
        } else {
            tFormError[input as keyof IFormEditSetError]("Formato de: " + input + " incorrecto!")
        }
        tForm[input as keyof IFormEditSetError](value)
        setErrorApi("")
        return regex.test(value);
    };

    const saveUser = () => {
        try {
            let existeError=false;
            Object.keys(tFormError).forEach(key => {
                const x = { text: key, value: updateDto[key as keyof IDataEditForm] }
                const validate = onChangeInput((updateDto[key as keyof IDataEditForm]).toString(), key)
                if(!validate){
                    existeError=true;
                }
            });
            updateDto.fecha = getStrFecha({ date: fecha }) || "";
            if (!existeError && updateDto.tipo !== "" && updateDto.responsable !== "" && updateDto.fecha) {
                putService("/tarea/edit/"+tarea?.id, updateDto).then((result) => {
                    setErrorApi(result.success ? "" : result.message);
                    if (result.success) {
                        console.log("resultedit",result.data)
                        const tareaRestult = tarea;
                        tareaRestult.tipo = result.data?.tipo;
                        tareaRestult.fecha = result.data?.fecha;
                        tareaRestult.fechaModificacion = result.data?.fechaModificacion;
                        tareaRestult.sucursalModificacion = result.data?.sucursalModificacion;
                        tareaRestult.usurioModificacion = result.data?.usurioModificacion;
                        tareaRestult.motivo = result.data?.motivo;
                        tareaRestult.recordatorio = result.data?.recordatorio;
                        tareaRestult.referencia = result.data?.referencia;
                        navigation.navigate(MenuPathEnum.TAREA_DETALLE, { tarea: tareaRestult })

                    }
                }).catch(e=>{
                    console.error(e.code,e.message)
                });
            } else {
                setErrorApi("Completar el formulario, porfavor!");
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

                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                        defaultButtonText={"Seleccione Tipo"}
                        defaultValue={Object.values(TipoTareaEnum)[Object.keys(TipoTareaEnum).indexOf(tipo||"")]}
                        renderDropdownIcon={isOpened => {
                            return <TextInput.Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                        }}
                    />
                </View>
                <View style={styles.formControl}>
                <TextInput
                        label="Cliente"
                        value={tarea?.cliente.nombre +" "+tarea?.cliente.ci + (tarea?.cliente.complemento !== "" ? " - " + tarea?.cliente.complemento : "") + " " + tarea?.cliente.extension}
                        mode="outlined"
                        disabled
                    />
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
                        value={recordatorio?.toString()}
                        placeholder="Recordatorio"
                        style={{ flex: 3 }}
                        onChangeText={text => onChangeInput(text, "recordatorio")}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Motivo"
                        value={motivo}
                        placeholder="Motivo"
                        onChangeText={text => onChangeInput(text, "motivo")}
                    />
                </View>

                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Referencia"
                        value={referencia}
                        placeholder="Referencia"
                        style={{ flex: 5 }}
                        onChangeText={text => onChangeInput(text, "referencia")}
                    />
                </View>

                <View>
                    <Chip icon="alert-circle" onPress={()=>setTipoError("")} style={{ display: tipoError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{tipoError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setRecordatorioError("")} style={{ display: recordatorioError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{recordatorioError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setMotivoError("")} style={{ display: motivoError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{motivoError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setReferenciaError("")} style={{ display: referenciaError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{referenciaError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setErrorApi("")} style={{ display: errorApi !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{errorApi }</Chip>
                </View>
                <Button mode="contained" style={styles.button} labelStyle={styles.labelStyle}
                    icon='content-save' onPress={() => saveUser()} >
                    {"Actualizar"}
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