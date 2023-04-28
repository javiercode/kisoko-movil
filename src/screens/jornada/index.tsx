import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ActivityIndicator, Avatar, Button, Card, Dialog, Divider, IconButton, Paragraph, Text } from 'react-native-paper';
import { Permission } from '../../components/Permission'
import { MenuPathEnum } from '../../utils/enums/Login.enum';
import { getService, postService } from '../../utils/HttpService';
import { MessageResponse } from '../../utils/interfaces/IGeneral';
import { IResultJornada, JornadaTipoEnum } from '../../utils/interfaces/IJornada';
import { getPosition } from '../../utils/MapUtils';
import Color from '../../utils/styles/Color';

let initDto = {
  inicio: "",
  fin: "",
  fecha: "",
} as IResultJornada;
let initResultDto = {
  code: 0,
  message: "",
  success: false
} as MessageResponse;

type Props = NativeStackScreenProps<any, MenuPathEnum.JORNADA>;
export default function Jornada({ route,navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [dataJornada, setDataJornada] = useState<IResultJornada>(initDto);
  const [resultJornada, setResultJornada] = useState<MessageResponse>(initResultDto);
  const [permission, sertPermission] = useState<boolean>(false);
  const [confirmMarcado, setConfirmMarcando] = useState<boolean>(false);

  useEffect(() => {
    getEstadoJornada();
  }, []);

  useEffect(() => {
  }, [dataJornada, resultJornada]);


  const getEstadoJornada = async () => {
    setLoading(true);
    getService(`/jornada/estado`)
      .then(res => {
        setResultJornada(res)
        if (res.success) {
          const result = res.data as IResultJornada;
          setDataJornada(result)
        }
      }).catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const marcarService = async (type: string) => {
    const position = await getPosition();

    let dataMarcado = {
      "tipo": type,
      "latitud": position.lat,
      "longitud": position.lng
    }
    setLoading(true);
    postService(`/jornada/marcar`, dataMarcado)
      .then(res => {
        setResultJornada(res)
        if (res.success) {
          getEstadoJornada()
        }
      }).catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const marcarJornada = () => {
    setConfirmMarcando(false)
    if(dataJornada.inicio==""){
      marcarService(JornadaTipoEnum.INICIO)
    }else{
      marcarService(JornadaTipoEnum.FIN)
    }
  }

  const hasPermission = (permiso: boolean) => {
    sertPermission(permiso)
}

  return (
    <>
      {loading &&
        <ActivityIndicator key={"jornada-indicator"} size="large" />
      }
      <Permission camera={false} location={true} read={false} write={false} bakground={false} setPermission={hasPermission} />
      <Card.Title key={"card-title-resumen"}
        title={dataJornada.fecha}
        titleStyle={{ textAlign: 'center', fontWeight: 'bold' }}
        subtitleStyle={{ textAlign: 'center' }}
        subtitle={resultJornada.message}
        right={(props) => 
          <IconButton key={"card-title-resumen-iconbutton"} {...props} size={30}
          style={{backgroundColor:Color.secondary}} color={Color.white}
            icon="refresh" onPress={() => { getEstadoJornada() }} />
        }
      />
      <Divider />
      <Card key={"card-inicio"}>
        <Card.Title
          title={"Inicio"}
          subtitle={dataJornada.inicio !== "" ? (dataJornada.inicio) : "Sin registro"}
          left={(props) => <Avatar.Icon {...props} icon={dataJornada.inicio !== "" ? "checkbox-marked-circle" : "alert-circle-check"} style={{ backgroundColor: dataJornada.inicio !== "" ? Color.primary : Color.error }} color={Color.white} />}
          
        />
      </Card>
      <Card key={"card-fin"}>
        <Card.Title
          title={"Fin"}
          subtitle={dataJornada.fin !== "" ? (dataJornada.fin) : "Sin registro"}
          left={(props) => <Avatar.Icon {...props} icon={dataJornada.fin !== "" ? "checkbox-marked-circle" : "alert-circle-check"} style={{ backgroundColor: dataJornada.fin !== "" ? Color.primary : Color.error }} color={Color.white} />}
          
        />
      </Card>
      <Card key={"card-marcar"}>
        <Card.Content style={{alignItems:'center'}}>
          <Button icon="cloud-check" mode='outlined' onPress={()=>setConfirmMarcando(true)} style={{backgroundColor:Color.secondary}} color={Color.white} >
            {`Marcar ${dataJornada.inicio==""? "Inicio":"Fin"} de Jornada`}
          </Button>
        </Card.Content>
      </Card>
      <Dialog visible={confirmMarcado} onDismiss={() => setConfirmMarcando(false)}>
                <Dialog.Content>
                    <Paragraph>¿Esta seguro de marcar {dataJornada.inicio==""? "Inicio":"Fin"} de su jornada</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setConfirmMarcando(false)}>Cancelar</Button>
                    <Button onPress={marcarJornada}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
    </>

  )
}
