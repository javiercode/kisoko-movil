import { Alert, DeviceEventEmitter, ToastAndroid } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { authorized, getAuth, noAuthorized, signIn, signOut, updateToken } from '../store/login';
import { MessageResponse, ResponseFetch } from './interfaces/IGeneral';
import { useNavigation } from '@react-navigation/native';
import { MenuPathEnum } from './enums/Login.enum';
import { ReducerType } from './interfaces/ILoginStore';


// const urlBase = ("http://api.dev.bg.com.bo/micliente/api/v3");
const urlBase = ("http://192.168.8.50:4000/kiosko/api/v1");
async function postService(url: string, data: any): Promise<MessageResponse> {
  return methodService('POST', url, data);
};
async function getService(url: string,): Promise<MessageResponse> {
  return methodService('GET', url, {});
};
async function putService(url: string, data: any): Promise<MessageResponse> {
  return methodService('PUT', url, data);
};
async function deleteService(url: string): Promise<MessageResponse> {
  return methodService('DELETE', url, {});
};


async function methodService(type: string, url: string, dataPost: any): Promise<MessageResponse> {
  let result = { success: false, message: "Error al conectarse con el servidor", code: 0 } as MessageResponse;

  try {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuth().token}`
    }
    let response = null;
    if (type == 'POST' || type == 'PUT') {
      response = await fetch(urlBase + url, {
        method: type,
        headers: headers,
        body: JSON.stringify(dataPost)
      });
    } else {
      response = await fetch(urlBase + url, {
        method: type,
        headers: headers,
      });
    }

    if (response && response.ok && response?.headers) {
      let authorization = response.headers.get('authorization') as string;
      updateToken(authorization);
      result = await response.json() as MessageResponse;
      ToastAndroid.showWithGravityAndOffset(
        result.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }else{
      switch (response.status) {
        case 401:
          result.message = "Demasiado tiempo inactivo, vuelva a loguearse";
          DeviceEventEmitter.emit(ReducerType.TOKEN_INVALID);
          break;
        case 500:
          result.message = "Error interno, vuelva a intentarlo";
          break;
        case 400:
          result.message = "Petición incorrecta, reintente otra vez";
          break;
      }
    }
    
    return result;
  } catch (error) {
    const response: MessageResponse = { success: false, message: 'Error de conexion', code: 0 };
    console.error('error message: ', error);
    return response;
  }
};

async function formDataService(url: string, dataForm: any, setUpload: (progress: number) => void): Promise<MessageResponse> {
  let response: MessageResponse = { success: false, message: 'Error cargar Archivos', code: 0 };
  try {
    const result = await ReactNativeBlobUtil.fetch('POST', urlBase + url, {
      Authorization: `Bearer ${getAuth().token}`,
      'Content-Type': 'multipart/form-data',
    }, dataForm).uploadProgress((written, total) => {
      setUpload((written / total))
    }).progress((received, total) => {
      setUpload((received / total))
    });
    let resultInfo = result.info();
    
    if (result && resultInfo.status==200) {
      //TODO:Aqui actualizar el token
    //   let authorization = response.headers.get('authorization') as string;
    //   updateToken(authorization);
      response = result.json() as MessageResponse;
      ToastAndroid.showWithGravityAndOffset(
        response.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }else{
      switch (resultInfo.status) {
        case 401:
          response.message = "Demasiado tiempo inactivo, vuelva a loguearse";
          DeviceEventEmitter.emit(ReducerType.TOKEN_INVALID);
          // noAuthorized()
          break;
        case 500:
          response.message = "Error interno, vuelva a intentarlo";
          break;
        case 400:
          response.message = "Petición incorrecta, reintente otra vez";
          break;
      }
    }
  } catch (error) {
    response.success = false;
    response.message = 'Error de conexion';
    return response;
  }
  ToastAndroid.showWithGravityAndOffset(
    response.message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
  return response;
};

async function doLogin(user: string, password: string): Promise<MessageResponse> {
  let response: MessageResponse = { success: false, message: 'Error de conexion', code: 0 };
  try {

    const username = user.toLocaleUpperCase();
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    console.log("login",urlBase + '/login')
    const result = await fetch(urlBase + '/login', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ username: username, password: password })
    });

    console.log("-------------------------------------------------")
    // console.log("auth",result)
    // console.log("auth",await result)
    // console.log("result.ok",result.ok)
    // console.log("url",urlBase+"/login")
    // const resultJson2 = await result.json();
    // console.log("resultJson", resultJson2)
    // console.log("resultJson", resultJson2)
    if (result.ok && result.status == 200) {
      const resultJson = await result.json();      
      console.log("login",resultJson);

      if (result && result?.headers && result?.headers) {
        let authorization = result.headers.get('authorization') as string;
        signIn(resultJson.data.NOMBRE, username, authorization, resultJson.data.ROL, 10000, resultJson.data.SUCURSALES, resultJson.data.DEPARTAMENTO);
        updateToken(authorization);
      }
1
      if (resultJson.success) {
        response = resultJson;
      }
    } else {
      response.message = "Servicio no disponible: " + result.statusText;
    }

  } catch (error) {
    response.message = "servicio no disponbile";
  }
  ToastAndroid.showWithGravityAndOffset(
    response.message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
  return response;
};


export {
  postService,
  getService,
  putService,
  deleteService,
  doLogin,
  formDataService
};