import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';
import { Title, Paragraph, TextInput, Button, Text, Switch, Card, Chip } from 'react-native-paper';
import Color from '../../utils/styles/Color';
import { getService, postService } from '../../utils/HttpService';
import { IDataCliente, EnumExtensionCliente, IDataForm, IFormError, IFormSetError } from '../../utils/interfaces/ICliente';
import SelectDropdown from 'react-native-select-dropdown'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import MapView, { Marker } from 'react-native-maps';
import { IMapConfig } from '../../utils/interfaces/IGeneral';
import { getInitMap, getPosition } from '../../utils/MapUtils';


let initDto: IDataForm = {
    nombre: "",
    telefono1: "",
    telefono2: "",
    direccion: "",
    ci: "",
    complemento: "",
    extension: "",
    comentario: "",
    latitud: 0,
    longitud: 0
};

let regexError: IFormError = {
    nombre: "^[a-zA-ZÀ-ÿ ]{1,200}$",
    telefono1: "^[0-9 ()-]{1,15}$",
    telefono2: "^[0-9 ()-]{0,15}$",
    direccion: "^[a-zA-Z0-9 .:#ñÑ]{1,200}$",
    ci: "^[0-9]{1,10}$",
    complemento: "^[a-zA-Z0-9 ]{0,3}$",
    extension: "^[A-Z]{1,2}$",
    comentario: "^[\\w\\W\\d\\D\\t\\n]{0,300}$",
    latitud: "^[\\w\\W\\d\\D\\t\\n]{0,300}$",
    longitud: "^[\\w\\W\\d\\D\\t\\n]{0,300}$",
};

const { width, height } = Dimensions.get('window');
let LATITUDE = 0;
let LONGITUDE = 0;
const ASPECT_RATIO = width / height;
const ALTITUDE = 13000;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

type Props = NativeStackScreenProps<any, MenuPathEnum.CLIENTE_DETAIL>;

export default function ClienteCreate({ route, navigation }: Props) {
    const [createDto, setCreateDto] = useState<IDataForm>(initDto);
    const [hasMap, setHasMap] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    const [initMapConfig, setInitMapConfig] = useState<IMapConfig>();

    const [nombreError, setNombreError] = React.useState<string>("");
    const [telefono1Error, setTelefono1Error] = React.useState<string>("");
    const [telefono2Error, setTelefono2Error] = React.useState<string>("");
    const [direccionError, setDireccionError] = React.useState<string>("");
    const [ciError, setCiError] = React.useState<string>("");
    const [complementoError, setComplementoError] = React.useState<string>("");
    const [extensionError, setExtensionError] = React.useState<string>("");
    const [latitudError, setLatitudError] = React.useState<string>("");
    const [longitudError, setLongitudError] = React.useState<string>("");
    const [comentarioError, setComentarioError] = React.useState<string>("");
    const [erroApi, setErrorApi] = React.useState<string>("");


    
    
    useEffect(() => {
        (async () => {
            const position = await getPosition();
            LATITUDE = position.lat;
            LONGITUDE = position.lng;
            setInitMapConfig(await getInitMap())
            setMapReady(true)
        })();
    }, [nombreError,telefono1Error, telefono2Error, direccionError, ciError, complementoError,
        extensionError, latitudError, longitudError, comentarioError, erroApi]);

    useEffect(() => {
        resetInfo()        
    }, []);
    

    let tFormError: IFormSetError = {
        nombre: setNombreError,
        telefono1: setTelefono1Error,
        telefono2: setTelefono2Error,
        direccion: setDireccionError,
        ci: setCiError,
        complemento: setComplementoError,
        extension: setExtensionError,
        comentario: setComentarioError,
        latitud: setLatitudError,
        longitud: setLongitudError
    };

    const resetInfo = ()=>{
        let resetInfo: IDataForm = {
            nombre: "",
            telefono1: "",
            telefono2: "",
            direccion: "",
            ci: "",
            complemento: "",
            extension: "",
            comentario: "",
            latitud: 0,
            longitud: 0
        };
        setCreateDto( resetInfo);
    }

    const onChangeInput = (value: string, input: string) => {
        let dto = createDto;
        let regex = new RegExp(regexError[input as keyof IFormError]);
        if (regex.test(value)) {
            dto[input as keyof IDataForm] = value;
            setCreateDto(dto);
            tFormError[input as keyof IFormSetError]("")
        } else {
            tFormError[input as keyof IFormSetError]("Formato de: " + input + " incorrecto!")
        }
    };

    const saveUser = () => {
        try {
            Object.keys(createDto).forEach(key => {
                const x = { text: key, value: createDto[key as keyof IDataForm] }
                onChangeInput((createDto[key as keyof IDataForm]).toString(), key)
            });
            if(!hasMap){
                resetUbicacion()
            }
            if (createDto.nombre !== "" && createDto.telefono1 !== "" && createDto.ci !== ""
                && createDto.extension !== "Seleccione" && createDto.direccion !== "") {
                createDto.nombre = createDto.nombre.toLocaleUpperCase();
                postService("/cliente/create", createDto).then((result) => {
                    console.log("result.message", result.message)
                    setErrorApi(result.success ? "" : result.message);
                    if (result.success) {
                        //                 getList();
                        resetInfo()
                        navigation.goBack();
                    }
                });
            } else {
                setErrorApi("Completar el formulario, porfavor!");
            }   
        } catch (error) {
            console.error(error)
        }
    };

    const handleMap = () => setHasMap(!hasMap);;

    const resetUbicacion = () => {
        let resetUbicacion: IDataForm = {
            nombre: createDto.nombre,
            telefono1: createDto.telefono1,
            telefono2: createDto.telefono2,
            direccion: createDto.direccion,
            ci: createDto.ci,
            complemento: createDto.complemento,
            extension: createDto.extension,
            comentario: createDto.comentario,
            latitud: 0,
            longitud: 0
        };
        setCreateDto(resetUbicacion);
    };

    const mapResolver = () => {
        setMapReady(true)
    }
    return (
        <ScrollView style={styles.container}>
            <View>
                <Title style={styles.title}>Crear</Title>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Nombre"
                        placeholder="Nombre Completo"
                        left={<TextInput.Icon name="briefcase-account" />}
                        onChangeText={text => onChangeInput(text, "nombre")}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Telefono 1"
                        placeholder="Telefono 1"
                        onChangeText={text => onChangeInput(text, "telefono1")}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Telefono 2"
                        placeholder="Telefono 2"
                        onChangeText={text => onChangeInput(text, "telefono2")}
                    />
                </View>
                <View style={styles.containerFlex}>
                    <TextInput
                        mode="outlined"
                        label="CI"
                        placeholder="Carnet de Identidad"
                        style={{ flex: 5 }}
                        onChangeText={text => onChangeInput(text, "ci")}
                    />
                    <TextInput
                        mode="outlined"
                        label="Complemento"
                        placeholder="Complemento"
                        style={{ flex: 3 }}
                        onChangeText={text => onChangeInput(text, "complemento")}
                    />
                </View>
                <View style={styles.formControl}>
                    <SelectDropdown
                        data={Object.values(EnumExtensionCliente)}
                        onSelect={(selectedItem, index) => {
                            onChangeInput(Object.keys(EnumExtensionCliente)[Object.values(EnumExtensionCliente).indexOf(selectedItem)], "extension")
                        }}
                        defaultButtonText="Selecciones una extensión"
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                        defaultValue={"Seleccione"}
                        renderDropdownIcon={isOpened => {
                            return <TextInput.Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18}/>;
                          }}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Direccion"
                        placeholder="Direccion"
                        onChangeText={text => onChangeInput(text, "direccion")}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                        mode="outlined"
                        label="Notas"
                        onChangeText={text => onChangeInput(text, "comentario")}
                    />
                </View>
                <View style={styles.containerFlex}>
                    <Title>Ubicación</Title>
                    <Switch color={Color.primary} value={hasMap} onValueChange={handleMap} thumbColor={Color.grayText} style={{borderEndColor:Color.gray}} />
                </View>
                {hasMap && mapReady &&
                    <Card.Content>
                        <MapView
                            initialRegion={initMapConfig}
                            style={{
                                width: (width * 0.9),
                                height: (width * 0.9),
                            }}
                            onMapReady={mapResolver}
                        >
                            <Marker
                                draggable
                                coordinate={{
                                    latitude: LATITUDE,
                                    longitude: LONGITUDE
                                }}
                                title="El Estarbocks"
                                description="Esto es el Estarbocks"
                                onDragEnd={(e) => { console.log('dragEnd', e.nativeEvent.coordinate) }}
                            />
                        </MapView>
                    </Card.Content>}

                <View>
                    <Chip icon="alert-circle" onPress={()=>setErrorApi("")} style={{ display: erroApi !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{erroApi }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setNombreError("")} style={{ display: nombreError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{nombreError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setTelefono1Error("")} style={{ display: telefono1Error !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{telefono1Error }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setTelefono2Error("")} style={{ display: telefono2Error !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{telefono2Error }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setDireccionError("")} style={{ display: direccionError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{direccionError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setCiError("")} style={{ display: ciError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{ciError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setComplementoError("")} style={{ display: complementoError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{complementoError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setExtensionError("")} style={{ display: extensionError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{extensionError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setLatitudError("")} style={{ display: latitudError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{latitudError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setLongitudError("")} style={{ display: longitudError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{longitudError }</Chip>
                    <Chip icon="alert-circle" onPress={()=>setComentarioError("")} style={{ display: comentarioError !== "" ? "flex" : "none", backgroundColor: Color.error }} textStyle={{ color: Color.white }} >{comentarioError }</Chip>
                    {/* <Text style={{ display: (erroApi !== "" ? "flex" : "none"), color: Color.error }}>{erroApi}</Text>
                    <Text style={{ display: (nombreError !== "" ? "flex" : "none"), color: Color.error }}>{nombreError}</Text>
                    <Text style={{ display: (telefono1Error !== "" ? "flex" : "none"), color: Color.error }}>{telefono1Error}</Text>
                    <Text style={{ display: (telefono2Error !== "" ? "flex" : "none"), color: Color.error }}>{telefono2Error}</Text>
                    <Text style={{ display: (direccionError !== "" ? "flex" : "none"), color: Color.error }}>{direccionError}</Text>
                    <Text style={{ display: (ciError !== "" ? "flex" : "none"), color: Color.error }}>{ciError}</Text>
                    <Text style={{ display: (complementoError !== "" ? "flex" : "none"), color: Color.error }}>{complementoError}</Text>
                    <Text style={{ display: (extensionError !== "" ? "flex" : "none"), color: Color.error }}>{extensionError}</Text>
                    <Text style={{ display: (latitudError !== "" ? "flex" : "none"), color: Color.error }}>{latitudError}</Text>
                    <Text style={{ display: (longitudError !== "" ? "flex" : "none"), color: Color.error }}>{longitudError}</Text>
                    <Text style={{ display: (comentarioError !== "" ? "flex" : "none"), color: Color.error }}>{comentarioError}</Text> */}
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
        backgroundColor: Color.grayBackground,
        color: Color.white,
    },
    dropdown1BtnStyle: {
        width:'100%',
        height: 50,
        backgroundColor: Color.white,
        borderRadius: 8,
        borderWidth: 1,
        // borderColor: '#444',
    },
})