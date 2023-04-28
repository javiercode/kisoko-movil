import moment from "moment";
import { ILocation } from "./interfaces/IGeneral";

export const formatFecha:string = "DD/MM/YYYY HH:mm:ss";

export const formatDateTime = (fecha: string | undefined): string => {
  if (fecha !== undefined) {
    var date = new Date(fecha);
    var dateStr = ("00" + date.getDate()).slice(-2) + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
    return dateStr;
  }
  return "";
}

export const formatDate = (fecha: string | undefined): string => {
  if (fecha !== undefined) {
    var date = new Date(fecha);
    var dateStr = ("00" + date.getDate()).slice(-2) + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear();
    return dateStr;
  }
  return "";
}

export function getFecha( date : Date | string): Date {
  let newDate: Date = new Date();
  if (typeof date === "string") {
      newDate = moment(date, formatFecha).utc().utcOffset("-04:00").toDate();
  }
  if (date instanceof Date) {
      newDate = moment(date).utc().utcOffset("-04:00").toDate();
  }
  return newDate;
}

export function getStrFecha({ date = new Date() }: { date: string | Date }): string {
  let newDate: string = "";
  if (typeof date === "string") {
      newDate = moment(date, formatFecha).utc().utcOffset("-04:00").format(formatFecha);
  }
  if (date instanceof Date) {
      newDate = moment(date).utc().utcOffset("-04:00").format(formatFecha);
  }
  return newDate;
}

export const ubicacionXDepartamento = (codigo: number): ILocation => {
  switch (codigo) {
    case 1: return { lat: -19.0311216, lng: -65.2711112,success:true }; break;
    case 2: return { lat: -16.4932221, lng: -68.1335063,success:true }; break;
    case 3: return { lat: -17.3939741, lng: -66.198895,success:true }; break;
    case 4: return { lat: -17.9611679, lng: -67.1224743,success:true }; break;
    case 5: return { lat: -19.5710531, lng: -65.7859079,success:true }; break;
    case 6: return { lat: -21.5217928, lng: -64.7971895,success:true }; break;
    case 7: return { lat: -17.7572662, lng: -63.1517186,success:true }; break;
    case 8: return { lat: -14.8299401, lng: -64.937811,success:true }; break;
    case 9: return { lat: -11.0345565, lng: -68.7948472,success:true }; break;
    default: return { lat: 0, lng: 0, success:false }; break;
  }
}