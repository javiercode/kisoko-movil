// import { useDispatch, useSelector, useStore } from 'react-redux';
import { store } from '../index';
import { addMovReducer, resetMovReducer, clearAllReducer } from './reducer'
import { IAddAction, IGaleriaReducer, IGaleriaStore } from '../../utils/interfaces/IMovimientoStore';
import { IGaleria } from '../../utils/interfaces/ITarea';

const addMovimiento = (idTarea:string ,galeriaList: IGaleria) => {
    const galeriaReducer:IGaleriaStore={
        galeriaList:galeriaList,
        idTarea:idTarea
    }
    store.dispatch(addMovReducer(galeriaReducer));
}

const clearMovimiento = (idTarea: string) => {
    store.dispatch(resetMovReducer(idTarea));
}

const resetAll = (galeriaList: IGaleriaReducer) => {
    store.dispatch(clearAllReducer());
}

const getMovimientos = (idTarea: string):IGaleria[] => {
    const aMovimientos = store.getState().MovReducer;
    const oTarea = aMovimientos.find(element => element.idTarea == idTarea)
    return oTarea?.galeriaList || [];
}

export { addMovimiento, clearMovimiento, resetAll, getMovimientos }